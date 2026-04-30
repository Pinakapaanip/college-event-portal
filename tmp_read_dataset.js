const XLSX = require('xlsx');
const path = require('path');

function read(file){
  const wb = XLSX.readFile(path.join(__dirname,'data',file));
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws,{defval:''});
}

const participants = read('final_matched_participants.xlsx');
const participation = read('updated_participation.xlsx');

console.log('participants cols:', Object.keys(participants[0]||{}).join(','));
console.log('participants count:', participants.length);
console.log('participants sample:', JSON.stringify(participants.slice(0,10), null, 2));

console.log('participation cols:', Object.keys(participation[0]||{}).join(','));
console.log('participation count:', participation.length);
console.log('participation sample:', JSON.stringify(participation.slice(0,10), null, 2));
