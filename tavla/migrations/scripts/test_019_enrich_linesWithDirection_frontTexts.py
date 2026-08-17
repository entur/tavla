"""
Enhetstester for de rene transform-funksjonene i migrering 019.

Tester kvalifisering og berikelse uten nettverk/Firestore — `cache` og `failed`
injiseres direkte. Sikkerhetsnett før en prod-migrering som muterer boards.

Kjør:
cd tavla/migrations
./migration run scripts/test_019_enrich_linesWithDirection_frontTexts.py
"""

import importlib.util
import os
import sys
import unittest

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))
if SCRIPTS_DIR not in sys.path:
    sys.path.insert(0, SCRIPTS_DIR)

_spec = importlib.util.spec_from_file_location(
    "migration_019",
    os.path.join(SCRIPTS_DIR, "019_enrich_linesWithDirection_frontTexts.py"),
)
migration = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(migration)

board_is_eligible = migration.board_is_eligible
tile_is_eligible = migration.tile_is_eligible
enrich_tile = migration.enrich_tile
transform_tiles = migration.transform_tiles
MIGRATION_017_RUN_MS = migration.MIGRATION_017_RUN_MS

DEP = "departures"


def tile(uuid="t1", quays=("Q1",), lines=None):
    return {
        "uuid": uuid,
        "quays": [{"id": q, "whitelistedLines": []} for q in quays],
        "linesWithDirection": list(lines or []),
    }


class BoardEligibility(unittest.TestCase):
    def test_eligible_when_modified_before_017(self):
        data = {"meta": {"dateModified": MIGRATION_017_RUN_MS - 1}}
        self.assertEqual(board_is_eligible(data), (True, ""))

    def test_not_eligible_when_saved_after_017(self):
        data = {"meta": {"dateModified": MIGRATION_017_RUN_MS + 1}}
        eligible, reason = board_is_eligible(data)
        self.assertFalse(eligible)
        self.assertEqual(reason, "lagret etter 017")

    def test_not_eligible_on_exact_cutoff(self):
        """Grensetilfelle: nøyaktig på cutoff regnes som lagret etter."""
        data = {"meta": {"dateModified": MIGRATION_017_RUN_MS}}
        self.assertFalse(board_is_eligible(data)[0])

    def test_not_eligible_when_missing_modified(self):
        eligible, reason = board_is_eligible({"meta": {}})
        self.assertFalse(eligible)
        self.assertEqual(reason, "mangler dateModified")


class TileEligibility(unittest.TestCase):
    def test_requires_quays(self):
        t = tile(quays=(), lines=[{"lineId": "L1", "frontTexts": ["A"]}])
        t["quays"] = []
        self.assertFalse(tile_is_eligible(t))

    def test_requires_at_least_one_explicit_fronttext(self):
        self.assertFalse(
            tile_is_eligible(tile(lines=[{"lineId": "L1", "frontTexts": []}]))
        )
        self.assertTrue(
            tile_is_eligible(tile(lines=[{"lineId": "L1", "frontTexts": ["A"]}]))
        )

    def test_mixed_tile_is_eligible(self):
        t = tile(lines=[
            {"lineId": "L1", "frontTexts": []},
            {"lineId": "L2", "frontTexts": ["B"]},
        ])
        self.assertTrue(tile_is_eligible(t))


class EnrichTile(unittest.TestCase):
    def test_adds_missing_fronttext(self):
        t = tile(lines=[{"lineId": "L1", "frontTexts": ["A"]}])
        cache = {("Q1", DEP): {"L1": {"A", "B"}}}
        lines, added, details = enrich_tile(t, DEP, cache)
        self.assertEqual(lines, 1)
        self.assertEqual(added, 1)
        self.assertEqual(t["linesWithDirection"][0]["frontTexts"], ["A", "B"])
        self.assertEqual(details, [("L1", ["B"])])

    def test_never_touches_all_directions_entry(self):
        """frontTexts: [] betyr alle retninger — å legge til ville snevret inn."""
        t = tile(lines=[{"lineId": "L1", "frontTexts": []}])
        cache = {("Q1", DEP): {"L1": {"A", "B"}}}
        lines, added, _ = enrich_tile(t, DEP, cache)
        self.assertEqual((lines, added), (0, 0))
        self.assertEqual(t["linesWithDirection"][0]["frontTexts"], [])

    def test_never_removes_existing_fronttexts(self):
        """En retning som ikke lenger observeres skal likevel beholdes."""
        t = tile(lines=[{"lineId": "L1", "frontTexts": ["A", "GAMMEL"]}])
        cache = {("Q1", DEP): {"L1": {"A"}}}
        lines, added, _ = enrich_tile(t, DEP, cache)
        self.assertEqual((lines, added), (0, 0))
        self.assertEqual(t["linesWithDirection"][0]["frontTexts"], ["A", "GAMMEL"])

    def test_no_change_when_nothing_new(self):
        t = tile(lines=[{"lineId": "L1", "frontTexts": ["A", "B"]}])
        cache = {("Q1", DEP): {"L1": {"A", "B"}}}
        self.assertEqual(enrich_tile(t, DEP, cache)[:2], (0, 0))

    def test_unions_across_tile_quays(self):
        t = tile(quays=("Q1", "Q2"), lines=[{"lineId": "L1", "frontTexts": ["A"]}])
        cache = {("Q1", DEP): {"L1": {"B"}}, ("Q2", DEP): {"L1": {"C"}}}
        lines, added, _ = enrich_tile(t, DEP, cache)
        self.assertEqual((lines, added), (1, 2))
        self.assertEqual(t["linesWithDirection"][0]["frontTexts"], ["A", "B", "C"])

    def test_ignores_lines_not_already_stored(self):
        """Migreringen legger aldri til nye linjer, kun retninger på eksisterende."""
        t = tile(lines=[{"lineId": "L1", "frontTexts": ["A"]}])
        cache = {("Q1", DEP): {"L1": {"A"}, "L2": {"X"}}}
        enrich_tile(t, DEP, cache)
        self.assertEqual(len(t["linesWithDirection"]), 1)
        self.assertEqual(t["linesWithDirection"][0]["lineId"], "L1")

    def test_does_not_use_other_quays_data(self):
        """Kun tileens egne quays skal brukes."""
        t = tile(quays=("Q1",), lines=[{"lineId": "L1", "frontTexts": ["A"]}])
        cache = {("Q1", DEP): {"L1": {"A"}}, ("Q99", DEP): {"L1": {"LEKKASJE"}}}
        self.assertEqual(enrich_tile(t, DEP, cache)[:2], (0, 0))

    def test_arrivals_and_departures_are_separate(self):
        t = tile(lines=[{"lineId": "L1", "frontTexts": ["A"]}])
        cache = {("Q1", "arrivals"): {"L1": {"B"}}}
        self.assertEqual(enrich_tile(t, DEP, cache)[:2], (0, 0))


class TransformTiles(unittest.TestCase):
    def test_does_not_mutate_input(self):
        tiles = [tile(lines=[{"lineId": "L1", "frontTexts": ["A"]}])]
        cache = {("Q1", DEP): {"L1": {"A", "B"}}}
        transform_tiles(tiles, DEP, cache, set())
        self.assertEqual(tiles[0]["linesWithDirection"][0]["frontTexts"], ["A"])

    def test_skips_tile_when_quay_lookup_failed(self):
        tiles = [tile(lines=[{"lineId": "L1", "frontTexts": ["A"]}])]
        cache = {("Q1", DEP): {"L1": {"A", "B"}}}
        new_tiles, changed, _, _, log = transform_tiles(
            tiles, DEP, cache, failed={("Q1", DEP)}
        )
        self.assertEqual(changed, 0)
        self.assertEqual(new_tiles[0]["linesWithDirection"][0]["frontTexts"], ["A"])
        self.assertTrue(any("hoppet over" in line for line in log))

    def test_counts_across_multiple_tiles(self):
        tiles = [
            tile("t1", lines=[{"lineId": "L1", "frontTexts": ["A"]}]),
            tile("t2", quays=("Q2",), lines=[{"lineId": "L2", "frontTexts": ["X"]}]),
        ]
        cache = {
            ("Q1", DEP): {"L1": {"A", "B"}},
            ("Q2", DEP): {"L2": {"X", "Y", "Z"}},
        }
        _, tiles_changed, lines_changed, added, _ = transform_tiles(
            tiles, DEP, cache, set()
        )
        self.assertEqual((tiles_changed, lines_changed, added), (2, 2, 3))

    def test_idempotent(self):
        """Andre kjøring skal ikke endre noe."""
        tiles = [tile(lines=[{"lineId": "L1", "frontTexts": ["A"]}])]
        cache = {("Q1", DEP): {"L1": {"A", "B"}}}
        once, _, _, _, _ = transform_tiles(tiles, DEP, cache, set())
        _, changed, _, _, _ = transform_tiles(once, DEP, cache, set())
        self.assertEqual(changed, 0)


if __name__ == "__main__":
    unittest.main(verbosity=2)
