import React from 'react';
import Table from './Table';
import Source from './Source'
import {FetchInfo, FetchState, fetchAndParse, updatedState} from "./FetchInfo";

const cbduAddress = "https://cbdu.ijp.pan.pl/"

function cbduFetchData(cgi/search/archive/simple/export_cbdu_JSON.js?dataset=archive&screen=Search&_action_export=1&output=JSON&exp=0%7C1%7C-date%2Fcreators_name%2Ftitle%7Carchive%7C-%7Cq%3A%3AALL%3AIN%3Aksi%C4%85%C5%BC%C4%99%7C-%7C&n=&cache=