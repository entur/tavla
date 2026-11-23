"""
Enhetstester for den rene transform-funksjonen i migrering 023.

Tester uten Firestore/DuckDB — mulige linjer per plattform injiseres direkte.

Kjør:
cd tavla/migrations
./migration run scripts/test_023_migrate_filter_selected_lines.py
"""

import importlib.util
import os
import sys
import unittest

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, SCRIPTS_DIR)

_spec = importlib.util.spec_from_file_location(
    "migration_023",
    os.path.join(SCRIPTS_DIR, "023_migrate_filter_selected_lines.py"),
)
migration = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(migration)

POSSIBLE = {"Q1": {"L1", "L2"}}


def no_lookup(quay_id):
    raise AssertionError(f"Journey Planner skal ikke kalles for {quay_id}")


def migrate_board(data, possible_lines, lookup_lines=no_lookup):
    return migration.migrate_board(data, possible_lines, lookup_lines)


def board(selected_lines, quay_id="Q1", filter_type="quaysFilter"):
    if filter_type == "quaysFilter":
        tile_filter = {
            "type": "quaysFilter",
            "quays": [{"id": quay_id, "selectedLines": list(selected_lines)}],
        }
    else:
        tile_filter = {
            "type": "stopPlaceFilter",
            "selectedTransportModes": [],
            "selectedLines": list(selected_lines),
        }
    return {"tiles": [{"uuid": "t1", "filter": tile_filter}]}


def selected_after(data):
    return data["tiles"][0]["filter"]["quays"][0]["selectedLines"]


class MigrateBoard(unittest.TestCase):
    def test_all_possible_selected_collapses(self):
        new_data, _, counts = migrate_board(board(["L1", "L2"]), POSSIBLE)
        self.assertEqual(selected_after(new_data), [])
        self.assertEqual(counts[migration.COLLAPSED], 1)

    def test_superset_with_stale_lines_collapses(self):
        new_data, _, _ = migrate_board(board(["L1", "L2", "OLD"]), POSSIBLE)
        self.assertEqual(selected_after(new_data), [])

    def test_partial_selection_unchanged(self):
        data = board(["L1"])
        new_data, _, counts = migrate_board(data, POSSIBLE, lambda _: {"L1", "L2"})
        self.assertEqual(new_data, data)
        self.assertEqual(counts[migration.PARTIAL], 1)

    def test_partial_in_gtfs_collapses_when_journey_planner_has_fewer_lines(self):
        """Sesonglinje L2 finnes i GTFS, men har ingen avganger de neste 30 dagene."""
        new_data, log_lines, counts = migrate_board(
            board(["L1"]), POSSIBLE, lambda _: {"L1"}
        )
        self.assertEqual(selected_after(new_data), [])
        self.assertEqual(counts[migration.COLLAPSED], 1)
        self.assertIn("kilde journey-planner", log_lines[0])

    def test_no_overlap_unchanged_and_flagged(self):
        data = board(["OLD"])
        new_data, _, counts = migrate_board(data, POSSIBLE)
        self.assertEqual(new_data, data)
        self.assertEqual(counts[migration.NO_OVERLAP], 1)

    def test_unknown_quay_unchanged_and_flagged(self):
        data = board(["L1"], quay_id="Q404")
        new_data, _, counts = migrate_board(data, POSSIBLE, lambda _: set())
        self.assertEqual(new_data, data)
        self.assertEqual(counts[migration.UNKNOWN_QUAY], 1)

    def test_unknown_quay_in_gtfs_collapses_when_journey_planner_matches(self):
        new_data, _, counts = migrate_board(
            board(["L9"], quay_id="Q404"), POSSIBLE, lambda _: {"L9"}
        )
        self.assertEqual(selected_after(new_data), [])
        self.assertEqual(counts[migration.COLLAPSED], 1)

    def test_journey_planner_failure_unchanged_and_flagged(self):
        data = board(["L1"])
        new_data, _, counts = migrate_board(data, POSSIBLE, lambda _: None)
        self.assertEqual(new_data, data)
        self.assertEqual(counts[migration.JP_FAILED], 1)

    def test_collapsed_by_gtfs_does_not_call_journey_planner(self):
        # no_lookup feiler testen hvis Journey Planner kalles
        new_data, _, _ = migrate_board(board(["L1", "L2"]), POSSIBLE)
        self.assertEqual(selected_after(new_data), [])

    def test_empty_selection_ignored(self):
        data = board([])
        new_data, log_lines, counts = migrate_board(data, POSSIBLE)
        self.assertEqual(new_data, data)
        self.assertEqual(log_lines, [])
        self.assertEqual(sum(counts.values()), 0)

    def test_stop_place_filter_ignored(self):
        data = board(["L1", "L2"], filter_type="stopPlaceFilter")
        new_data, _, counts = migrate_board(data, POSSIBLE)
        self.assertEqual(new_data, data)
        self.assertEqual(sum(counts.values()), 0)

    def test_tile_without_filter_ignored(self):
        data = {"tiles": [{"uuid": "t1", "quays": []}]}
        self.assertEqual(migrate_board(data, POSSIBLE)[0], data)

    def test_input_not_mutated(self):
        data = board(["L1", "L2"])
        migrate_board(data, POSSIBLE)
        self.assertEqual(selected_after(data), ["L1", "L2"])


class CachedLookup(unittest.TestCase):
    def test_looks_up_each_quay_once(self):
        calls = []
        original = migration.fetch_departure_lines
        migration.fetch_departure_lines = lambda quay_id: calls.append(quay_id) or None
        try:
            lookup = migration.cached_lookup({})
            lookup("Q1")
            lookup("Q1")
            lookup("Q2")
        finally:
            migration.fetch_departure_lines = original
        self.assertEqual(calls, ["Q1", "Q2"])


if __name__ == "__main__":
    unittest.main()
