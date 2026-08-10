"""
Enhetstester for de rene transform-funksjonene i migrering 017.

Tester klassifisering og transform uten nettverk/Firestore — `cache` og `failed`
injiseres direkte. Sikkerhetsnett før en engangs prod-migrering som muterer alle
boards.

Kjør: 
cd tavla/migrations
./migration run scripts/test_017_migrate_quays_to_linesWithDirection.py

"""

import importlib.util
import os
import sys
import unittest

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, SCRIPTS_DIR)

_spec = importlib.util.spec_from_file_location(
    "migration_017",
    os.path.join(SCRIPTS_DIR, "017_migrate_quays_to_linesWithDirection.py"),
)
migration = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(migration)

classify_tile = migration.classify_tile
build_stop_place_legacy = migration.build_stop_place_legacy
build_quay_lines_with_direction = migration.build_quay_lines_with_direction
transform_tiles = migration.transform_tiles


class ClassifyTile(unittest.TestCase):
    def test_already_migrated_when_field_present_even_if_empty(self):
        self.assertEqual(classify_tile({"linesWithDirection": []}), "already_migrated")
        self.assertEqual(
            classify_tile(
                {
                    "linesWithDirection": [{"lineId": "L1", "frontTexts": []}],
                    "quays": [{"id": "Q1", "whitelistedLines": ["L1"]}],
                }
            ),
            "already_migrated",
        )

    def test_quay_when_quays_nonempty(self):
        self.assertEqual(
            classify_tile({"quays": [{"id": "Q1", "whitelistedLines": ["L1"]}]}),
            "quay",
        )

    def test_stop_place_legacy(self):
        self.assertEqual(
            classify_tile({"quays": [], "whitelistedLines": ["L1"]}),
            "stop_place_legacy",
        )

    def test_show_all(self):
        self.assertEqual(classify_tile({"quays": [], "whitelistedLines": []}), "show_all")
        self.assertEqual(classify_tile({}), "show_all")

    def test_quays_wins_over_whitelisted(self):
        self.assertEqual(
            classify_tile(
                {
                    "quays": [{"id": "Q1", "whitelistedLines": ["L1"]}],
                    "whitelistedLines": ["L9"],
                }
            ),
            "quay",
        )


class BuildStopPlaceLegacy(unittest.TestCase):
    def test_dedup_and_empty_fronttexts(self):
        tile = {"whitelistedLines": ["L1", "L2", "L1"]}
        self.assertEqual(
            build_stop_place_legacy(tile),
            [{"lineId": "L1", "frontTexts": []}, {"lineId": "L2", "frontTexts": []}],
        )


class BuildQuayLinesWithDirection(unittest.TestCase):
    def test_explicit_whitelist_uses_fronttexts(self):
        tile = {"quays": [{"id": "Q1", "whitelistedLines": ["L1"]}]}
        cache = {("Q1", "departures"): {"all_lines": {"L1", "L2"}, "fronttexts": {"L1": {"Nord"}}}}
        self.assertEqual(
            build_quay_lines_with_direction(tile, "departures", cache),
            [{"lineId": "L1", "frontTexts": ["Nord"]}],
        )

    def test_explicit_whitelist_without_fronttexts_is_failopen(self):
        tile = {"quays": [{"id": "Q1", "whitelistedLines": ["L1"]}]}
        cache = {("Q1", "departures"): {"all_lines": {"L1"}, "fronttexts": {}}}
        self.assertEqual(
            build_quay_lines_with_direction(tile, "departures", cache),
            [{"lineId": "L1", "frontTexts": []}],
        )

    def test_empty_whitelist_uses_all_lines(self):
        tile = {"quays": [{"id": "Q1", "whitelistedLines": []}]}
        cache = {("Q1", "departures"): {"all_lines": {"L1", "L2"}, "fronttexts": {"L1": {"Nord"}}}}
        result = build_quay_lines_with_direction(tile, "departures", cache)
        self.assertEqual(
            {e["lineId"]: e["frontTexts"] for e in result},
            {"L1": ["Nord"], "L2": []},
        )

    def test_union_across_quays(self):
        tile = {
            "quays": [
                {"id": "Q1", "whitelistedLines": ["L1"]},
                {"id": "Q2", "whitelistedLines": ["L1"]},
            ]
        }
        cache = {
            ("Q1", "departures"): {"all_lines": {"L1"}, "fronttexts": {"L1": {"Nord"}}},
            ("Q2", "departures"): {"all_lines": {"L1"}, "fronttexts": {"L1": {"Sør"}}},
        }
        self.assertEqual(
            build_quay_lines_with_direction(tile, "departures", cache),
            [{"lineId": "L1", "frontTexts": ["Nord", "Sør"]}],
        )

    def test_fronttexts_sorted(self):
        tile = {"quays": [{"id": "Q1", "whitelistedLines": ["L1"]}]}
        cache = {
            ("Q1", "departures"): {
                "all_lines": {"L1"},
                "fronttexts": {"L1": {"Storo", "Bergkrystallen"}},
            }
        }
        self.assertEqual(
            build_quay_lines_with_direction(tile, "departures", cache),
            [{"lineId": "L1", "frontTexts": ["Bergkrystallen", "Storo"]}],
        )


class TransformTiles(unittest.TestCase):
    def test_stop_place_legacy_sets_field(self):
        tiles = [{"uuid": "t1", "quays": [], "whitelistedLines": ["L1"]}]
        new_tiles, changed, deferred, _ = transform_tiles(tiles, "departures", {}, set())
        self.assertEqual((changed, deferred), (1, 0))
        self.assertEqual(new_tiles[0]["linesWithDirection"], [{"lineId": "L1", "frontTexts": []}])

    def test_quay_sets_field(self):
        tiles = [{"uuid": "t1", "quays": [{"id": "Q1", "whitelistedLines": ["L1"]}]}]
        cache = {("Q1", "departures"): {"all_lines": {"L1"}, "fronttexts": {"L1": {"Nord"}}}}
        new_tiles, changed, deferred, _ = transform_tiles(tiles, "departures", cache, set())
        self.assertEqual((changed, deferred), (1, 0))
        self.assertEqual(
            new_tiles[0]["linesWithDirection"], [{"lineId": "L1", "frontTexts": ["Nord"]}]
        )

    def test_quay_with_failed_lookup_is_deferred_and_not_written(self):
        tiles = [{"uuid": "t1", "quays": [{"id": "Q1", "whitelistedLines": ["L1"]}]}]
        new_tiles, changed, deferred, _ = transform_tiles(
            tiles, "departures", {}, {("Q1", "departures")}
        )
        self.assertEqual((changed, deferred), (0, 1))
        self.assertNotIn("linesWithDirection", new_tiles[0])

    def test_show_all_and_already_migrated_untouched(self):
        tiles = [
            {"uuid": "s", "quays": [], "whitelistedLines": []},
            {
                "uuid": "m",
                "quays": [],
                "linesWithDirection": [{"lineId": "L1", "frontTexts": []}],
            },
        ]
        new_tiles, changed, deferred, _ = transform_tiles(tiles, "departures", {}, set())
        self.assertEqual((changed, deferred), (0, 0))
        self.assertNotIn("linesWithDirection", new_tiles[0])
        self.assertEqual(
            new_tiles[1]["linesWithDirection"], [{"lineId": "L1", "frontTexts": []}]
        )

    def test_original_tiles_not_mutated(self):
        tiles = [{"uuid": "t1", "quays": [{"id": "Q1", "whitelistedLines": ["L1"]}]}]
        cache = {("Q1", "departures"): {"all_lines": {"L1"}, "fronttexts": {"L1": {"Nord"}}}}
        transform_tiles(tiles, "departures", cache, set())
        self.assertNotIn("linesWithDirection", tiles[0])


if __name__ == "__main__":
    unittest.main()
