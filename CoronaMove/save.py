import csv

def save_to_file(infos):
  file = open("confirmed_case_moves.csv", mode="w")
  writer = csv.writer(file)
  writer.writerow(["region","region_gu","place","address","exposed_date","IsDisinfect"])

  for info in infos:
    writer.writerow(list(info.values())) 
  return 