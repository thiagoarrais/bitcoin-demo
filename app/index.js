import React from 'react';
import ReactDOM from 'react-dom';
import { Buffer } from 'buffer';
import blockdb from './blockdb';

const normalizeInt = (n) => n.toString(16).split(/(?=(?:..)*$)/).reverse().join('');
const normalizeHex = (str) => str.toString('hex').split(/(?=(?:..)*$)/).reverse().join('');

const normalizeBlock = ({
  ver,
  prev_block,
  mrkl_root,
  time,
  bits
}) => {
  return
    normalizeInt(ver) +
    normalizeHex(prev_block) +
    normalizeHex(mrkl_root) +
    normalizeInt(time) +
    normalizeInt(bits);
};

const blockhash = (blockdata, nonce) => {
  const inputData = normalizeBlock(blockdata) + normalizeInt(nonce);
};

const Hash = () => {
  return <div>Hello, world!</div>;
};

ReactDOM.render(
  <Hash />,
  document.getElementById('root')
);