from google.cloud import firestore

import init

boards = "boards"

def read_columns(db: firestore.Client): 
    board_collection = db.collection(boards).stream()
    total_boards = 0
    multi_tile_boards = 0
    different_columns_board = 0

    for board in board_collection:
        total_boards += 1

        board_dict = board.to_dict()
        board_tiles = board_dict.get("tiles")

        if (len(board_tiles) > 1):
            multi_tile_boards += 1 
            temp_column = []
            for tile in board_tiles:
                if (len(temp_column) == 0):
                    temp_column = tile["columns"]
                else:
                    if (temp_column != tile["columns"]):
                        different_columns_board += 1
                        break
                
    print(f"total boards: {total_boards} - boards with several tiles: {multi_tile_boards} - boards with tiles with different columns: {different_columns_board}")
    if(multi_tile_boards != 0 and total_boards != 0):
        print(f"percentage of all boards that have different columns: {round(different_columns_board/total_boards*100,2)}%\npercentage of boards with more than one column: {round(different_columns_board/multi_tile_boards*100,2)}%")

def read():
    db = init.local("ent-tavla-local-countcolumn")

    print(f"db: {db.project}, {db._emulator_host}")
    read_columns(db)

read()