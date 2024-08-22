import crop
import sudoku

if __name__ == "__main__" :
    # crop sudoku from picture
    M = crop.crop_and_recognize()
    print(M)
    S = sudoku.solveSudoku(M)
    print(S)