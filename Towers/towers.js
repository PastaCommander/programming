'use strict';


$(document).ready((event) => {
  let t = makeLatinSquare(5);

  if (!isLatinSquare(t)) {
    alert('is not a latin square')
  }

  generateTable(t);

  console.log('loaded just fine');
})


function makeLatinSquare(n) {
  let t = [];

  for (let i = 0; i < n; i++) {
    let r = [];

    for (let j = 0; j < n; j++) {
      r[j] = (3*i+j)%n;
    }

    t[i] = r;
  }

  return t;
}


function isLatinSquare(t) {
  let n = t.length;

  // make sure it's a square with latin rows
  for (let i = 0; i < n; i++) {
    let r = t[i];
    if (n != r.length || !isLatinArray(r, n)) {
       return false;
    }
  }

  // make sure the columns are latin
  for (let j = 0; j < n; j++) {
    // check column j
    let c = [];
    for (let i = 0; i < n; i++) {
      c[i] = t[i][j];
    }
    if (!isLatinArray(c, n)) {
      return false;
    }
  }

  return true;
}


function isLatinArray(a, n) {
  let found = [];
  for (let j = 0; j < n; j++) {
    let v = a[j]
    if (v < 0 || n <= v || found[v]) {
      return false;
    }
    found[v] = true;
  }
  return true;
}


function generateTable(t) {
  // get the reference for the table
  let table = $('<table>');

  // creating all cells
  for (let i = 0; i < t.length; i++) {
    // creates a table row
    let row = $('<tr>');
    let r = t[i];

    for (let j = 0; j < r.length; j++) {
      // Create a <td> element and a text node, make the text
      // node the contents of the <td>, and put the <td> at
      // the end of the table row
      let cell = $('<td>').text(r[j]);
      row.append(cell);
    }

    // add the row to the end of the table body
    table.append(row);
  }

  // put the <tbody> in the <table>
  $('#main').append(table);
}
