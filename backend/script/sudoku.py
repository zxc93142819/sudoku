# print("sudoku.py is running")

import sys
import json
board = json.loads(sys.argv[1])
for i in range(9) :
    for j in range(9) :
        if(board[i][j] == '') :
            board[i][j] = 0

def check(i,j,board,num):
    if(num in board[i]):return False
    if(num in [board[row][j] for row in range(9)]):return False
    for r in range((i//3)*3,((i//3)*3)+3):
        for c in range((j//3)*3,((j//3)*3)+3):
            if(board[r][c]==num):return False
    return True

def rec(board,i,j):
    if(j==9):
        i+=1;j=0
    if(i==9):
        return True
    if(board[i][j]==0):
        for num in range(1,10):
            if(check(i,j,board,num)):
                board[i][j]=num
                if(rec(board,i,j+1)):return True
                board[i][j]=0
        return False
    else:
        return rec(board,i,j+1)
    
def is_valid_board(board):
    for i in range(9):
        row = [num for num in board[i] if num != 0]
        if len(row) != len(set(row)):
            return False
        col = [board[r][i] for r in range(9) if board[r][i] != 0]
        if len(col) != len(set(col)):
            return False
    for box_i in range(3):
        for box_j in range(3):
            nums = []
            for i in range(box_i*3, box_i*3+3):
                for j in range(box_j*3, box_j*3+3):
                    if board[i][j] != 0:
                        nums.append(board[i][j])
            if len(nums) != len(set(nums)):
                return False
    return True

if not is_valid_board(board):
    print(str(json.dumps([])))
    sys.stdout.flush()
    sys.exit(0)

success = rec(board, 0, 0)
if not success:
    print(str(json.dumps([])))  # 回傳空陣列代表無解
else:
    data = []
    for i in range(9):
        for j in range(9):
            data.append(board[i][j])
    print(str(json.dumps(data)))
sys.stdout.flush()