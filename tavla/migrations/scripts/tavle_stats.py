import argparse
import json
import logging
import os
from collections import Counter
from datetime import datetime
from pathlib import Path
from typing import Dict, Iterable, Optional, Set, Tuple

import requests

import init

HEARTBEAT_URL = "https://tavla-api.entur.no/heartbeat/active"
STOP_PLACE_URL = "https://api.entur.io/stop-places/v1/read/stop-places/"
QUAY_URL = "https://api.entur.io/stop-places/v1/read/quays/"
TOPOGRAPHIC_PLACE_URL = "https://api.entur.io/stop-places/v1/read/topographic-places/"
GEOCODER_URL = "https://api.entur.io/geocoder/v1/reverse"
APP_ROOT = Path(__file__).resolve().parents[2]
ENV_LOCAL_PATH = APP_ROOT / ".env.local"
CLIENT_HEADER = {"ET-Client-Name": "tavla-board-stats"}
OUTPUT_PREFIX = "tavle-tall-"
REQUEST_TIMEOUT = 10

logger = logging.getLogger("tavle_stats")


class EnturLookup:
    """Helper for Entur API lookups with simple caching."""

    def __init__(self) -> None:
        self._place_cache: Dict[str, Optional[Dict]] = {}
        self._topo_cache: Dict[str, Optional[Dict]] = {}
        self._county_cache: Dict[str, Optional[str]] = {}
        self._geocode_cache: Dict[Tuple[float, float], Optional[str]] = {}

    def get_place_details(self, place_id: str) -> Optional[Dict]:
        if place_id in self._place_cache:
            return self._place_cache[place_id]
        if place_id.startswith("NSR:StopPlace:"):
            url = STOP_PLACE_URL + place_id
        elif place_id.startswith("NSR:Quay:"):
            url = QUAY_URL + place_id
        else:
            self._place_cache[place_id] = None
            return None
        try:
            logger.debug("Henter detaljer for %s", place_id)
            resp = requests.get(url, headers=CLIENT_HEADER, timeout=REQUEST_TIMEOUT)
        except requests.RequestException as exc:
            logger.warning("Feil ved oppslag av %s: %s", place_id, exc)
            self._place_cache[place_id] = None
            return None
        if resp.status_code != 200:
            logger.warning("Oppslag %s ga status %s", place_id, resp.status_code)
            self._place_cache[place_id] = None
            return None
        data = resp.json()
        centroid = data.get("centroid", {})

        # Entur responses sometimes nest coordinates directly or under "location".
        lat = centroid.get("latitude")
        lon = centroid.get("longitude")
        if lat is None or lon is None:
            location = centroid.get("location", {})
            lat = location.get("latitude")
            lon = location.get("longitude")
        details = {
            "raw": data,
            "lat": lat,
            "lon": lon,
            "topographic_ref": None,
            "place_id": place_id,
        }
        topo_ref = data.get("topographicPlaceRef")
        if isinstance(topo_ref, dict):
            details["topographic_ref"] = topo_ref.get("ref")
        self._place_cache[place_id] = details
        return details

    def resolve_county(self, place_id: str) -> Optional[str]:
        details = self.get_place_details(place_id)
        if not details:
            return None
        topo_ref = details.get("topographic_ref")
        if topo_ref:
            county = self.resolve_county_from_topographic_place(topo_ref)
            if county:
                return county
        lat = details.get("lat")
        lon = details.get("lon")
        if lat is not None and lon is not None:
            return self.reverse_geocode_county(lat, lon)
        return None

    def resolve_county_from_topographic_place(self, ref: str) -> Optional[str]:
        if ref in self._county_cache:
            return self._county_cache[ref]
        data = self.get_topographic_place(ref)
        if not data:
            self._county_cache[ref] = None
            return None
        place_type = data.get("topographicPlaceType")
        if place_type == "COUNTY":
            name = self._extract_name(data)
            self._county_cache[ref] = name
            return name
        parent = data.get("parentTopographicPlaceRef")
        parent_ref = parent.get("ref") if isinstance(parent, dict) else None
        if parent_ref:
            county = self.resolve_county_from_topographic_place(parent_ref)
            self._county_cache[ref] = county
            return county
        self._county_cache[ref] = None
        return None

    def get_topographic_place(self, ref: str) -> Optional[Dict]:
        if ref in self._topo_cache:
            return self._topo_cache[ref]
        try:
            logger.debug("Henter topografisk sted")
            resp = requests.get(
                TOPOGRAPHIC_PLACE_URL + ref, headers=CLIENT_HEADER, timeout=REQUEST_TIMEOUT
            )
        except requests.RequestException as exc:
            logger.warning("Feil ved oppslag av topografisk sted: %s", exc)
            self._topo_cache[ref] = None
            return None
        if resp.status_code != 200:
            logger.warning("Oppslag topografisk sted ga status %s", resp.status_code)
            self._topo_cache[ref] = None
            return None
        data = resp.json()
        self._topo_cache[ref] = data
        return data

    def reverse_geocode_county(self, lat: float, lon: float) -> Optional[str]:
        key = (round(lat, 6), round(lon, 6))
        if key in self._geocode_cache:
            return self._geocode_cache[key]
        params = {"point.lat": lat, "point.lon": lon}
        try:
            resp = requests.get(GEOCODER_URL, headers=CLIENT_HEADER, params=params, timeout=REQUEST_TIMEOUT)
        except requests.RequestException as exc:
            logger.warning("Feil ved reverse geocode: %s", exc)
            self._geocode_cache[key] = None
            return None
        if resp.status_code != 200:
            logger.warning("Reverse geocode ga status %s", resp.status_code)
            self._geocode_cache[key] = None
            return None
        try:
            data = resp.json()
            features = data.get("features", [])
        except json.JSONDecodeError:
            logger.warning("Ugyldig JSON fra reverse geocode")
            self._geocode_cache[key] = None
            return None
        county = None
        for feature in features:
            props = feature.get("properties", {})
            county = props.get("county")
            if county:
                break
        self._geocode_cache[key] = county
        return county

    @staticmethod
    def _extract_name(data: Dict) -> Optional[str]:
        descriptor = data.get("descriptor")
        if isinstance(descriptor, dict):
            name = descriptor.get("name")
            if isinstance(name, dict):
                return name.get("value")
        return None



def load_env_value(key: str) -> str:
    """
    Retrieves the value of a specified key from an environment file located in the script's directory.

    Args:
        key (str): The name of the environment variable to retrieve.

    Returns:
        str: The value associated with the specified key.

    """
    env_path = ENV_LOCAL_PATH
    if not env_path.exists():
        raise FileNotFoundError(f"Fant ikke {env_path}")
    with env_path.open("r", encoding="utf-8") as handle:
        for line in handle:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            k, value = line.split("=", 1)
            if k.strip() == key:
                return value.strip().strip('"')
    raise KeyError(f"Fant ikke nøkkelen {key} i {env_path}")


def fetch_heartbeat_clients(api_key: str) -> Dict:
    headers = {"Authorization": f"Bearer {api_key}"}
    try:
        resp = requests.get(HEARTBEAT_URL, headers=headers, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
    except requests.RequestException as exc:
        raise RuntimeError(f"Feil ved henting av heartbeat-data: {exc}") from exc
    return resp.json()


def unique_bids(clients: Iterable[Dict]) -> Set[str]:
    return {client["bid"] for client in clients if isinstance(client, dict) and client.get("bid")}


def collection_count(db, collection_name: str) -> int:
    coll = db.collection(collection_name)
    try:
        agg = coll.count().get()
        if agg:
            return int(agg[0]["count"])
    except Exception:
        pass
    return sum(1 for _ in coll.stream())


def fetch_boards(db) -> Dict[str, Dict]:
    boards = {}
    for doc in db.collection("boards").stream():
        boards[doc.id] = doc.to_dict() or {}
    return boards


def palette_distribution(boards: Iterable[Dict]) -> Counter:
    counter: Counter = Counter()
    for board in boards:
        palette = board.get("transportPalette")
        counter[palette or "(ikke-valgt)"] += 1
    return counter


def palette_distribution_for_ids(boards: Dict[str, Dict], ids: Iterable[str]) -> Counter:
    counter: Counter = Counter()
    for bid in ids:
        board = boards.get(bid)
        if not board:
            counter["(ukjent tavle)"] += 1
            continue
        palette = board.get("transportPalette")
        counter[palette or "(ikke-valgt)"] += 1
    return counter


def board_place_ids(board: Dict) -> Set[str]:
    tiles = board.get("tiles")
    place_ids: Set[str] = set()
    if isinstance(tiles, list):
        for tile in tiles:
            if isinstance(tile, dict):
                place_id = tile.get("placeId")
                if place_id:
                    place_ids.add(place_id)
    return place_ids


def active_boards_per_county(boards: Dict[str, Dict], active_ids: Set[str], lookup: EnturLookup) -> Tuple[Counter, Set[str]]:
    """
    Counts the number of active boards per county and identifies unresolved board IDs.

    Args:
        boards (Dict[str, Dict]): A dictionary mapping board IDs to board data.
        active_ids (Set[str]): A set of active board IDs to process.
        lookup (EnturLookup): An object used to resolve county information from place IDs.

    Returns:
        Tuple[Counter, Set[str]]:
            - Counter: A counter mapping county names to the number of active boards in each county.
            - Set[str]: A set of board IDs that could not be resolved to any county.
    """

    county_counter: Counter = Counter()
    unresolved: Set[str] = set()
    for bid in active_ids:
        board = boards.get(bid)
        if not board:
            unresolved.add(bid)
            continue
        counties: Set[str] = set()
        for place_id in board_place_ids(board):
            county = lookup.resolve_county(place_id)
            if county:
                counties.add(county)
        if counties:
            for county in counties:
                county_counter[county] += 1
            if len(counties) > 1:
                logger.info("Tavle %s tilhører %s fylker", bid, len(counties))
        else:
            unresolved.add(bid)
            logger.warning("Fant ikke fylke for tavle %s", bid)
    return county_counter, unresolved


def format_counter(counter: Counter) -> str:
    lines = []
    for key, value in counter.most_common():
        label = key if key else "(ikke-valgt)"
        lines.append(f"- {label}: {value}")
    if not lines:
        lines.append("- (ingen data)")
    return "\n".join(lines)

def _location_records_for_place(place_id: str, details: Dict) -> Iterable[Dict[str, Optional[str]]]:
    """Returner lokasjonsoppslag for en NSR-id."""
    raw = details.get("raw") or {}
    yielded = False
    if place_id.startswith("NSR:StopPlace:"):
        quays = raw.get("quays")
        if isinstance(quays, list):
            for quay in quays:
                if not isinstance(quay, dict):
                    continue
                lat = quay.get("latitude")
                lon = quay.get("longitude")
                if lat is None or lon is None:
                    continue
                name = None
                name_data = quay.get("name")
                if isinstance(name_data, dict):
                    value = name_data.get("value")
                    if isinstance(value, str):
                        name = value
                yielded = True
                yield {
                    "id": quay.get("id"),
                    "name": name,
                    "latitude": lat,
                    "longitude": lon,
                }
        if yielded:
            return
    lat = details.get("lat")
    lon = details.get("lon")
    if lat is None or lon is None:
        return
    name = None
    name_data = raw.get("name")
    if isinstance(name_data, dict):
        value = name_data.get("value")
        if isinstance(value, str):
            name = value
    yield {
        "id": raw.get("id", place_id),
        "name": name,
        "latitude": lat,
        "longitude": lon,
    }


def export_board_locations(
    boards: Dict[str, Dict],
    active_ids: Iterable[str],
    lookup: EnturLookup,
    output_path: Path,
) -> None:
    features: Dict[str, Dict] = {}
    missing_places: Set[str] = set()
    for bid in active_ids:
        board = boards.get(bid)
        if not board:
            continue
        for place_id in board_place_ids(board):
            details = lookup.get_place_details(place_id)
            if not details:
                missing_places.add(place_id)
                continue
            for loc in _location_records_for_place(place_id, details):
                lid = loc.get("id") or place_id
                lat = loc.get("latitude")
                lon = loc.get("longitude")
                if lat is None or lon is None:
                    continue
                feature = features.get(lid)
                if feature is None:
                    feature = {
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [lon, lat],
                        },
                        "properties": {
                            "id": lid,
                            "name": loc.get("name"),
                            "boardCount": 0,
                            "boardIds": set(),
                            "sourcePlaceIds": set(),
                        },
                    }
                    features[lid] = feature
                props = feature["properties"]
                board_ids: Set[str] = props["boardIds"]
                if bid not in board_ids:
                    board_ids.add(bid)
                    props["boardCount"] += 1
                props["sourcePlaceIds"].add(place_id)
    if not features:
        logger.info("Fant ingen tavle-lokasjoner å eksportere")
        return
    geojson_features = []
    for feature in features.values():
        props = feature["properties"]
        props["boardIds"] = sorted(props["boardIds"])
        props["sourcePlaceIds"] = sorted(props["sourcePlaceIds"])
        geojson_features.append(feature)
    geojson = {"type": "FeatureCollection", "features": geojson_features}
    output_path.write_text(json.dumps(geojson, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    logger.info("Skrev %s tavle-lokasjoner til %s", len(geojson_features), output_path)
    if missing_places:
        logger.info("Hoppet over %s placeId-er uten lokasjonsdata", len(missing_places))


def parse_args(argv: Optional[Iterable[str]] = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generer tavle-statistikk")
    parser.add_argument(
        "--export-locations",
        action="store_true",
        help="Eksporter GeoJSON med tavle-lokasjoner basert på aktive tavler",
    )
    parser.add_argument(
        "--locations-path",
        type=Path,
        help="Filsti for GeoJSON-eksport (default: board_locations.geojson i skript-mappen)",
    )
    return parser.parse_args(list(argv) if argv is not None else None)


def main(argv: Optional[Iterable[str]] = None) -> None:
    args = parse_args(argv)

    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
    logger.info("Starter tavle-statistikk")

    api_key = load_env_value("BACKEND_API_KEY")
    logger.info("Henter heartbeat-data")
    heartbeat_data = fetch_heartbeat_clients(api_key)
    clients = heartbeat_data.get("clients", [])
    active_unique_ids = unique_bids(clients)
    active_total_count = len(clients)
    logger.info("Fant %s heartbeat-oppføringer", active_total_count)
    logger.info("Fant %s unike tavle-ID-er", len(active_unique_ids))

    cwd = os.getcwd()
    try:
        os.chdir(APP_ROOT)
        logger.info("Initierer Firestore prod-klient")
        db = init.prod()
    finally:
        os.chdir(cwd)
    logger.info("Henter boards")
    boards = fetch_boards(db)

    total_boards = len(boards)
    active_unique_count = len(active_unique_ids)
    active_count = active_total_count
    user_count = collection_count(db, "users")
    folder_count = collection_count(db, "folders")
    logger.info("Antall aktive tavler (inkl. duplikater): %s", active_count)
    logger.info("Antall aktive unike tavler: %s", active_unique_count)
    logger.info("Antall brukere: %s, mapper: %s",  user_count, folder_count)

    palette_all = palette_distribution(boards.values())
    palette_active = palette_distribution_for_ids(boards, active_unique_ids)

    lookup = EnturLookup()
    logger.info("Slår opp fylker for aktive tavler")
    county_counts, unresolved_boards = active_boards_per_county(boards, active_unique_ids, lookup)

    resolved_total = sum(county_counts.values())
    if resolved_total != active_unique_count:
        logger.warning(
            "Antall unike aktive tavler (%s) stemmer ikke med sum fordelt på fylker (%s)",
            active_unique_count,
            resolved_total,
        )
    if unresolved_boards:
        logger.warning("Fant ikke fylke for %s aktive tavler: %s", len(unresolved_boards))

    if args.export_locations:
        locations_path = args.locations_path or (Path(__file__).resolve().parent / "board_locations.geojson")
        logger.info("Eksporterer tavle-lokasjoner til %s", locations_path)
        export_board_locations(boards, active_unique_ids, lookup, locations_path)

    today = datetime.now().strftime("%d-%m-%Y")
    output_name = f"{OUTPUT_PREFIX}{today}.txt"
    output_path = Path(__file__).resolve().parent / output_name

    lines = [
        f"📝 Rapport generert: {datetime.now().isoformat(timespec='seconds')}",
        "",
        f"🖥️ Totalt antall tavler i databasen: {total_boards}",
        f"🫀 Aktive tavler (heartbeat):{active_count} (unike: {active_unique_count})",
        f"👥 Antall brukere i databasen: {user_count}",
        f"📁 Antall mapper i databasen: {folder_count}",
        "",
        "🎨 Fordeling av transportpaletter (alle tavler, aktive tavler):",
        format_counter(palette_all),
        "",
        format_counter(palette_active),
        "",
        "🗺️ Aktive tavler per fylke:",
        format_counter(county_counts),
    ]

    if unresolved_boards:
        unresolved_sorted = sorted(unresolved_boards)
        lines.extend(
            [
                "",
                f"Tavler uten fylke-data: {len(unresolved_sorted)}",
                ", ".join(unresolved_sorted),
            ]
        )

    output_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    logger.info("Skrev rapport til %s", output_path)


if __name__ == "__main__":
    main()
