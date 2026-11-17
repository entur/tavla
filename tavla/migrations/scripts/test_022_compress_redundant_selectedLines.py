"""
Enhetstester for de rene transform-funksjonene i migrering 022.

Tester kvalifisering og komprimering uten nettverk/DuckDB/Firestore — `cache`
injiseres direkte, akkurat som i test_019. Sikkerhetsnett før en prod-migrering
som muterer boards.

Kjør:
cd tavla/migrations
./migration run scripts/test_022_compress_redundant_selectedLines.py
"""

import importlib.util
import os
import sys
import unittest

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, SCRIPTS_DIR)

_spec = importlib.util.spec_from_file_location(
    "migration_022",
    os.path.join(SCRIPTS_DIR, "022_compress_redundant_selectedLines.py"),
)
migration = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(migration)

selected_lines_is_all = migration.selected_lines_is_all
compress_quays_filter = migration.compress_quays_filter
compress_stop_place_filter = migration.compress_stop_place_filter
compress_tile = migration.compress_tile
transform_tiles = migration.transform_tiles
tile_is_eligible = migration.tile_is_eligible
quays_filter_quay_entries = migration.quays_filter_quay_entries
stop_place_filter_is_eligible = migration.stop_place_filter_is_eligible


def empty_cache():
    return {
        "quay_lines_all": {},
        "quay_lines_30d": {},
        "stopplace_lines_all": {},
        "stopplace_lines_30d": {},
    }


def quays_filter_tile(uuid="t1", quays=None):
    return {
        "uuid": uuid,
        "stopPlaceId": "NSR:StopPlace:1",
        "filter": {"type": "quaysFilter", "quays": quays or []},
    }


def stop_place_filter_tile(uuid="t1", stop_place_id="NSR:StopPlace:1", selected_lines=None):
    return {
        "uuid": uuid,
        "stopPlaceId": stop_place_id,
        "filter": {
            "type": "stopPlaceFilter",
            "selectedTransportModes": ["bus"],
            "selectedLines": selected_lines or [],
        },
    }


class SelectedLinesIsAll(unittest.TestCase):
    def test_matches_quay_lines_all(self):
        cache = empty_cache()
        cache["quay_lines_all"]["Q1"] = {"L1", "L2"}
        self.assertTrue(selected_lines_is_all(["L1", "L2"], "Q1", cache))

    def test_matches_quay_lines_30d(self):
        cache = empty_cache()
        cache["quay_lines_30d"]["Q1"] = {"L1"}
        self.assertTrue(selected_lines_is_all(["L1"], "Q1", cache))

    def test_no_match_partial_selection(self):
        cache = empty_cache()
        cache["quay_lines_all"]["Q1"] = {"L1", "L2", "L3"}
        self.assertFalse(selected_lines_is_all(["L1", "L2"], "Q1", cache))

    def test_no_match_extra_line_selected(self):
        """Mengde-likhet, ikke bare antall: et annet linjesett av samme størrelse matcher ikke."""
        cache = empty_cache()
        cache["quay_lines_all"]["Q1"] = {"L1", "L2"}
        self.assertFalse(selected_lines_is_all(["L1", "L3"], "Q1", cache))

    def test_unknown_quay_never_matches(self):
        """Quay ikke funnet i GTFS -> alltid False, aldri gjett."""
        cache = empty_cache()
        self.assertFalse(selected_lines_is_all(["L1"], "Q_UKJENT", cache))

    def test_empty_selection_never_matches(self):
        cache = empty_cache()
        cache["quay_lines_all"]["Q1"] = set()
        self.assertFalse(selected_lines_is_all([], "Q1", cache))

    def test_stopplace_lookup(self):
        cache = empty_cache()
        cache["stopplace_lines_all"]["NSR:StopPlace:1"] = {"L1", "L2"}
        self.assertTrue(selected_lines_is_all(["L1", "L2"], "NSR:StopPlace:1", cache))


class CompressQuaysFilter(unittest.TestCase):
    def test_compresses_matching_quay(self):
        cache = empty_cache()
        cache["quay_lines_all"]["Q1"] = {"L1", "L2"}
        filt = {"type": "quaysFilter", "quays": [{"id": "Q1", "selectedLines": ["L1", "L2"]}]}
        new_filter, changed, logs = compress_quays_filter(filt, cache)
        self.assertTrue(changed)
        self.assertEqual(new_filter["quays"], [])  # eneste quay ble tom -> hele arrayet komprimeres
        self.assertTrue(logs)

    def test_leaves_partial_filter_untouched(self):
        cache = empty_cache()
        cache["quay_lines_all"]["Q1"] = {"L1", "L2", "L3"}
        filt = {"type": "quaysFilter", "quays": [{"id": "Q1", "selectedLines": ["L1"]}]}
        new_filter, changed, logs = compress_quays_filter(filt, cache)
        self.assertFalse(changed)
        self.assertEqual(new_filter, filt)
        self.assertEqual(logs, [])

    def test_mixed_quays_only_matching_one_compressed(self):
        """Én quay matcher, en annen er et bevisst delvis filter -> arrayet kollapser IKKE helt."""
        cache = empty_cache()
        cache["quay_lines_all"]["Q1"] = {"L1", "L2"}
        cache["quay_lines_all"]["Q2"] = {"L3", "L4", "L5"}
        filt = {
            "type": "quaysFilter",
            "quays": [
                {"id": "Q1", "selectedLines": ["L1", "L2"]},
                {"id": "Q2", "selectedLines": ["L3"]},
            ],
        }
        new_filter, changed, logs = compress_quays_filter(filt, cache)
        self.assertTrue(changed)
        self.assertEqual(new_filter["quays"][0], {"id": "Q1", "selectedLines": []})
        self.assertEqual(new_filter["quays"][1], {"id": "Q2", "selectedLines": ["L3"]})

    def test_unverified_quay_blocks_whole_array_collapse(self):
        """Én quay matcher og komprimeres, men en annen er ukjent i GTFS -> ikke kollaps av hele arrayet."""
        cache = empty_cache()
        cache["quay_lines_all"]["Q1"] = {"L1"}
        filt = {
            "type": "quaysFilter",
            "quays": [
                {"id": "Q1", "selectedLines": ["L1"]},
                {"id": "Q_UKJENT", "selectedLines": ["L9"]},
            ],
        }
        new_filter, changed, logs = compress_quays_filter(filt, cache)
        self.assertTrue(changed)
        self.assertEqual(new_filter["quays"][0], {"id": "Q1", "selectedLines": []})
        self.assertEqual(new_filter["quays"][1], {"id": "Q_UKJENT", "selectedLines": ["L9"]})

    def test_no_candidates_no_change(self):
        cache = empty_cache()
        filt = {"type": "quaysFilter", "quays": [{"id": "Q1", "selectedLines": []}]}
        new_filter, changed, logs = compress_quays_filter(filt, cache)
        self.assertFalse(changed)
        self.assertEqual(new_filter, filt)


class CompressStopPlaceFilter(unittest.TestCase):
    def test_compresses_selected_lines_only(self):
        cache = empty_cache()
        cache["stopplace_lines_30d"]["SP1"] = {"L1", "L2"}
        filt = {"type": "stopPlaceFilter", "selectedTransportModes": ["bus"], "selectedLines": ["L1", "L2"]}
        new_filter, changed, logs = compress_stop_place_filter(filt, "SP1", cache)
        self.assertTrue(changed)
        self.assertEqual(new_filter["selectedLines"], [])
        self.assertEqual(new_filter["selectedTransportModes"], ["bus"], "selectedTransportModes skal aldri røres")

    def test_leaves_partial_filter_untouched(self):
        cache = empty_cache()
        cache["stopplace_lines_all"]["SP1"] = {"L1", "L2", "L3"}
        filt = {"type": "stopPlaceFilter", "selectedTransportModes": [], "selectedLines": ["L1"]}
        new_filter, changed, logs = compress_stop_place_filter(filt, "SP1", cache)
        self.assertFalse(changed)
        self.assertEqual(new_filter, filt)

    def test_empty_selected_lines_no_change(self):
        cache = empty_cache()
        filt = {"type": "stopPlaceFilter", "selectedTransportModes": [], "selectedLines": []}
        new_filter, changed, logs = compress_stop_place_filter(filt, "SP1", cache)
        self.assertFalse(changed)


class CompressTile(unittest.TestCase):
    def test_dispatches_quays_filter(self):
        cache = empty_cache()
        cache["quay_lines_all"]["Q1"] = {"L1"}
        tile = quays_filter_tile(quays=[{"id": "Q1", "selectedLines": ["L1"]}])
        new_tile, changed, logs = compress_tile(tile, cache)
        self.assertTrue(changed)
        self.assertEqual(new_tile["filter"]["quays"], [])

    def test_dispatches_stop_place_filter(self):
        cache = empty_cache()
        cache["stopplace_lines_all"]["NSR:StopPlace:1"] = {"L1"}
        tile = stop_place_filter_tile(selected_lines=["L1"])
        new_tile, changed, logs = compress_tile(tile, cache)
        self.assertTrue(changed)
        self.assertEqual(new_tile["filter"]["selectedLines"], [])

    def test_no_filter_no_change(self):
        cache = empty_cache()
        tile = {"uuid": "t1", "stopPlaceId": "SP1"}
        new_tile, changed, logs = compress_tile(tile, cache)
        self.assertFalse(changed)
        self.assertEqual(new_tile, tile)


class Eligibility(unittest.TestCase):
    def test_quays_filter_requires_non_empty_selected_lines(self):
        tile = quays_filter_tile(quays=[{"id": "Q1", "selectedLines": []}])
        self.assertEqual(quays_filter_quay_entries(tile), [])
        self.assertFalse(tile_is_eligible(tile))

    def test_quays_filter_eligible_with_selected_lines(self):
        tile = quays_filter_tile(quays=[{"id": "Q1", "selectedLines": ["L1"]}])
        self.assertEqual(len(quays_filter_quay_entries(tile)), 1)
        self.assertTrue(tile_is_eligible(tile))

    def test_stop_place_filter_requires_non_empty_selected_lines(self):
        tile = stop_place_filter_tile(selected_lines=[])
        self.assertFalse(stop_place_filter_is_eligible(tile))
        self.assertFalse(tile_is_eligible(tile))

    def test_stop_place_filter_eligible_with_selected_lines(self):
        tile = stop_place_filter_tile(selected_lines=["L1"])
        self.assertTrue(stop_place_filter_is_eligible(tile))
        self.assertTrue(tile_is_eligible(tile))


class TransformTiles(unittest.TestCase):
    def test_does_not_mutate_input(self):
        cache = empty_cache()
        cache["quay_lines_all"]["Q1"] = {"L1"}
        tiles = [quays_filter_tile(quays=[{"id": "Q1", "selectedLines": ["L1"]}])]
        transform_tiles(tiles, cache)
        self.assertEqual(tiles[0]["filter"]["quays"][0]["selectedLines"], ["L1"])

    def test_counts_across_multiple_tiles(self):
        cache = empty_cache()
        cache["quay_lines_all"]["Q1"] = {"L1"}
        cache["stopplace_lines_all"]["SP2"] = {"L2"}
        tiles = [
            quays_filter_tile("t1", quays=[{"id": "Q1", "selectedLines": ["L1"]}]),
            stop_place_filter_tile("t2", stop_place_id="SP2", selected_lines=["L2"]),
        ]
        new_tiles, tiles_changed, log_lines = transform_tiles(tiles, cache)
        self.assertEqual(tiles_changed, 2)
        self.assertEqual(new_tiles[0]["filter"]["quays"], [])
        self.assertEqual(new_tiles[1]["filter"]["selectedLines"], [])

    def test_idempotent(self):
        """Andre kjøring skal ikke endre noe — komprimerte tiles er ikke lenger kvalifiserte."""
        cache = empty_cache()
        cache["quay_lines_all"]["Q1"] = {"L1", "L2"}
        tiles = [quays_filter_tile(quays=[{"id": "Q1", "selectedLines": ["L1", "L2"]}])]
        once, changed_once, _ = transform_tiles(tiles, cache)
        self.assertEqual(changed_once, 1)
        twice, changed_twice, _ = transform_tiles(once, cache)
        self.assertEqual(changed_twice, 0)

    def test_never_expands_a_filter(self):
        """Ingen transform-funksjon skal noensinne LEGGE TIL linjer i selectedLines."""
        cache = empty_cache()
        cache["quay_lines_all"]["Q1"] = {"L1", "L2", "L3"}
        tiles = [quays_filter_tile(quays=[{"id": "Q1", "selectedLines": ["L1"]}])]
        new_tiles, changed, _ = transform_tiles(tiles, cache)
        self.assertEqual(changed, 0)
        self.assertEqual(new_tiles[0]["filter"]["quays"][0]["selectedLines"], ["L1"])


if __name__ == "__main__":
    unittest.main(verbosity=2)
