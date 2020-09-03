from corona import get_info
from save import save_to_file
from convert_json import convert

if __name__ == '__main__':
    info = get_info()
    save_to_file(info)
    convert()