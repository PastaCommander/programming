'use strict';


let latinSquareSize = 5;


$(document).ready((event) => {
  let ls = makeLatinSquare(latinSquareSize);

  if (!isLatinSquare(ls)) {
    alert('is not a latin square')
  }

  let hints = {
    top: [],
    bot: [],
    lft: [],
    rgt: [],
  };

  // populate hints.top
  for (let j = 0; j < ls.length; j++) {
    // check column j
    let c = [];
    for (let i = 0; i < ls.length; i++) {
      c[i] = ls[i][j];
    }
    hints.top[j] = computeVisible(c);
  }

  // populate hints.bot
  for (let j = 0; j < ls.length; j++) {
    // check column j
    let c = [];
    for (let i = 0; i < ls.length; i++) {
      c[i] = ls[i][j];
    }
    hints.bot[j] = computeVisible(c.reverse());
  }

  // populate hints.lft
  for (let i = 0; i < ls.length; i++) {
    hints.lft[i] = computeVisible(ls[i]);
  }

  // populate hints.rgt
  for (let i = 0; i < ls.length; i++) {
    hints.rgt[i] = computeVisible(ls[i].slice().reverse());
  }

  generateTable(ls, hints);

  console.log('loaded just fine');
})


function computeVisible(towers) {
  let hintN   = 1;
  let tallest = towers[0];
  // starting at 1 because towers{0} is always visible
  for (let i = 1; i < towers.length; i++) {
    if (towers[i] > tallest) {
      tallest = towers[i];
      hintN++;
    }
  }

  return hintN;
}


function makeLatinSquare(n) {
  // build a latin square with shuffled rows, columns, and numbers
  let ls = [];
  let sr = shuffledN(n);
  let sc = shuffledN(n);
  let sn = shuffledN(n);

  for (let i = 0; i < n; i++) {
    let r = [];

    for (let j = 0; j < n; j++) {
      r[j] = sn[(sr[i]+sc[j])%n];
    }

    ls[i] = r;
  }

  return ls;
}


function shuffledN(n) {
  let a = [];

  for (let i = 0; i < n; i++) {
    a[i] = i;
  }

  return shuffle(a);
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isLatinSquare(ls) {
  let n = ls.length;

  if (n < 1) {
    return false;
  }

  function isLatinArray(a) {
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

  // make sure it's a square with latin rows
  for (let i = 0; i < n; i++) {
    let r = ls[i];
    if (n != r.length || !isLatinArray(r)) {
       return false;
    }
  }

  // make sure the columns are latin
  for (let j = 0; j < n; j++) {
    // check column j
    let c = [];
    for (let i = 0; i < n; i++) {
      c[i] = ls[i][j];
    }
    if (!isLatinArray(c)) {
      return false;
    }
  }

  return true;
}


function generateTable(ls, hints) {
  // get the reference for the table
  let table = $('<table>');

  // add top hints
  let row = $('<tr>');
  row.append($('<td>').addClass('hint'));
  for (let j = 0; j < hints.top.length; j++) {
    let cell = $('<td>').addClass('hint').text(hints.top[j]);
    row.append(cell);
  }
  row.append($('<td>').addClass('hint'));
  table.append(row);

  // creating all cells
  for (let i = 0; i < ls.length; i++) {
    // creates a table row
    let row = $('<tr>');
    let r = ls[i];

    row.append($('<td>').addClass('hint').text(hints.lft[i]));

    for (let j = 0; j < r.length; j++) {
      // Create a <td> element and a text node, make the text
      // node the contents of the <td>, and put the <td> at
      // the end of the table row
      let cell = $('<td>').addClass('tower').text(r[j]/*+1*/);
      row.append(cell);
    }

    row.append($('<td>').addClass('hint').text(hints.rgt[i]));
    // add the row to the end of the table body
    table.append(row);
  }

  // add bottom hints
  row = $('<tr>');
  row.append($('<td>').addClass('hint'));
  for (let j = 0; j < hints.bot.length; j++) {
    let cell = $('<td>').addClass('hint').text(hints.bot[j]);
    row.append(cell);
  }
  row.append($('<td>').addClass('hint'));
  table.append(row);

  // put the <table> in the <div>
  $('#main').append(table);
}

