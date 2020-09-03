import csv
import json
def length_of_reader(filename, fieldnames):
  with open(filename, mode="r") as infile:
    reader = csv.DictReader(infile, fieldnames)
    length = -1
    for row in reader:
      length += 1
    return length
def convert():
  # input_file = open("confirmed_case_moves.csv", mode="r")

  # reader = csv.reader(input_file)

  # col_names = next(reader)

  # jdata = json.dumps(col_names, indent = 4)

  # with open("CCM.json","w") as handle:
  #   print(jdata, file = handle)
  # return

  csvfile = open("confirmed_case_moves.csv", mode="r")
  jsonfile = open("CCM.json",mode="w")

  fieldnames = ("region","region_gu","place","address","exposed_date","IsDisinfect")

  reader = csv.DictReader(csvfile, fieldnames)
  length = length_of_reader("confirmed_case_moves.csv", fieldnames)
  jsonfile.write('[\n  ')
  nowindex = 0
  for row in reader:
    json.dump(row, jsonfile)
    if (nowindex != length):
      jsonfile.write(',\n  ')
    else:
      jsonfile.write('\n')
    nowindex += 1
  jsonfile.write(']')
  return 
