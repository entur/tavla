from google.cloud import firestore
from typing import Dict

import init

boards = "boards"

def count_transport_palettes(db: firestore.Client):
    board_collection = db.collection(boards).stream()

    defaultPalette = 0
    blueBusPalette = 0
    greenBusPalette = 0

    newDefault = 0
    newBlue = 0
    newGreen = 0

    with open("updated_boards.txt", "a") as log_file:

        for board in board_collection:
            b = board.to_dict()
            palette = b.get("transportPalette")
            meta = b.get("meta", {})
            created = meta.get("created")
        

            if not palette:
                continue

            if (created >= 1752537600000): 
                if (palette == "default"):
                    newDefault += 1
                elif (palette == "blue-bus"):
                    newBlue += 1
                elif (palette == "green-bus"):
                    newGreen += 1

            else:
                if (palette == "default"):
                    defaultPalette += 1
                elif (palette == "blue-bus"):
                    blueBusPalette += 1
                elif (palette == "green-bus"):
                    greenBusPalette += 1
        
        log_file.write(f"Old default palette: {defaultPalette}\n")
        log_file.write(f"Old blue bus palette: {blueBusPalette}\n")
        log_file.write(f"Old green bus palette: {greenBusPalette}\n")
        log_file.write(f"-----------------------------------\n")
        log_file.write(f"New default palette: {newDefault}\n")
        log_file.write(f"New blue palette: {newBlue}\n")
        log_file.write(f"New green palette: {newGreen}\n")
        log_file.write(f"-----------------------------------\n")
        log_file.write(f"Total boards counted: {defaultPalette + blueBusPalette + greenBusPalette + newDefault + newBlue + newGreen}\n")

def where_are_they(db: firestore.Client):
    board_collection = db.collection(boards).stream()

    with open("boards_placememt.txt", "a") as log_file:

        for board in board_collection:
            b = board.to_dict()

            palette = b.get("transportPalette")
            tiles = b.get("tiles")

            if not palette:
                print("⚠️ No palette, skipping board")
                continue

            if (palette == "blue-bus"):

                if not isinstance(tiles, list):
                    print("⚠️  Tiles is not a list, skipping board")
                    continue

                names = []

                for i, tile in enumerate(tiles):
                    print(f"  --Tile[{i}] -> {tile}")
                    if isinstance(tile, dict):
                        name = tile.get("name")
                        if name:
                            names.append(name)
                            print(f"    ✅ Found name: {name}")
                        else:
                            print("    ⚠️  No name key in this tile")
                    else:
                        print("    ⚠️  Tile is not a dict")

                if names:
                    log_line = f"* {' | '.join(names)}\n"
                    print(f"Writing: {log_line.strip()}")
                    log_file.write(f"BLUE, {log_line}")
            
                
            if (palette == "green-bus"):

                if not isinstance(tiles, list):
                    print("⚠️  Tiles is not a list, skipping board")
                    continue

                names = []

                for i, tile in enumerate(tiles):
                    print(f"  --Tile[{i}] -> {tile}")
                    if isinstance(tile, dict):
                        name = tile.get("name")
                        if name:
                            names.append(name)
                            print(f"    ✅ Found name: {name}")
                        else:
                            print("    ⚠️  No name key in this tile")
                    else:
                        print("    ⚠️  Tile is not a dict")

                if names:
                    log_line = f"* {' | '.join(names)}\n"
                    print(f"Writing: {log_line.strip()}")
                    log_file.write(f"GREEN, {log_line}")
                
def count(): 
    db = init.prod()
    print(f"db: {db.project}, {db._emulator_host}")
    count_transport_palettes(db)
    where_are_they(db)

count()