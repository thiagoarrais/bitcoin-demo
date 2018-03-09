import React from 'react';
import ReactDOM from 'react-dom';
import { Buffer } from 'buffer';
import crypto from 'crypto';
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
  return (
    normalizeInt(ver) +
    normalizeHex(prev_block) +
    normalizeHex(mrkl_root) +
    normalizeInt(time) +
    normalizeInt(bits)
  );
};

const blockhash = (blockdata, nonce) => {
  const inputData = normalizeBlock(blockdata) + normalizeInt(nonce);
  const blockbuffer = Buffer.from(inputData, "hex");

  const firstpass = crypto.createHash('sha256').update(blockbuffer).digest();
  const blockhash = crypto.createHash('sha256').update(firstpass).digest();

  const bigendian = blockhash.toString('hex').split(/(?=(?:..)*$)/).reverse().join('');
  
  return bigendian.toString('hex');
};


class Hash extends React.Component {
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      0
    );
  }
  
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.nonce = 0;
    this.target
    this.setState({
      date: new Date()
    });
  }

}

const Hash = () => {
  //trying to check block 499512
  const expectedhash = blockdb[0].hash;
  const hash = blockhash(blockdb[0], 1473437695);
  const checks =
    hash === expectedhash ?
      'ok' :
      'err';
  
  return <div>{hash} {checks}</div>;
};

ReactDOM.render(
  <Hash />,
  document.getElementById('root')
);