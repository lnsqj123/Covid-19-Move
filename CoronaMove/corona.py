import requests
from bs4 import BeautifulSoup

URL = "http://ncov.mohw.go.kr/bdBoardList_Real.do?brdId=1&brdGubun=12&ncvContSeq=&contSeq=&board_id=&gubun="


def get_tr():

    rq = requests.get(URL)
    soup = BeautifulSoup(rq.text, "html.parser")
    confirmed_case_moves = soup.find("div", {
        "class": "data_table midd"
    }).find("tbody").find_all("tr")

    return confirmed_case_moves


def extract_confirmed_case_info(html):

    region = html.find("th").get_text()

    region_gu = html.find("td").get_text()

    td_place = html.td.next_sibling.next_sibling
    place = td_place.get_text()

    td_address = td_place.next_sibling.next_sibling
    address = td_address.get_text()

    td_exposed_date = td_address.next_sibling.next_sibling
    exposed_date = td_exposed_date.get_text()

    td_IsDisinfect = td_exposed_date.next_sibling.next_sibling
    IsDisinfect = td_IsDisinfect.get_text()

    return {
        'region': region,
        'region_gu': region_gu,
        'place': place,
        'address': address,
        'exposed_date': exposed_date,
        'IsDisinfect': IsDisinfect
    }


def extract_onebyon():

    infos = []

    rq = requests.get(URL)
    soup = BeautifulSoup(rq.text, "html.parser")
    moves = soup.find("div", {
        "class": "data_table midd"
    }).find("tbody").find_all("tr")

    for move in moves:
        info = extract_confirmed_case_info(move)
        infos.append(info)

    return infos


def get_info():
    info = extract_onebyon()
    return info