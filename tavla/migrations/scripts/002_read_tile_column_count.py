"""
Purpose: Count number of tiles in each board

Description:
    This counts the number of boards with more than one tile, and that does not
    have identical columns. Used as a measure of how much the customisable 
    columns functionality is used. 

Usage:
    ./migration run scripts/002_read_tile_column_count.py

Date: 2025-05-16
Author: Annika
"""

from google.cloud import firestore

import init

boards = "boards"

# Reads through the values in the database and increments the correct
# counts when the correct requirements are met.
# No transaction needed as we are only reading values from the database.
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