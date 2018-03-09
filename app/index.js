import React from 'react';
import ReactDOM from 'react-dom';
import { Buffer } from 'buffer';
import crypto from 'crypto';
import blockdb from './blockdb';

const normalizeInt = (n) => ("00000000" + n.toString(16)).slice(-8).split(/(?=(?:..)*$)/).reverse().join('');
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
  constructor(props) {
    super(props);
    this.nonce = -1;
    this.state = {percent: 0};
  }
  
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
    this.nonce = this.nonce + 1;
    this.targetNonce = 2999858432;
    
    const hash = blockhash(blockdb[1], this.nonce);
    
    const percent = Math.floor(this.nonce / this.targetNonce * 100);
    if (this.state.percent < percent) {
      this.setState({
        percent 
      });
    }
  }
  
  render() {
    return (
      <div>{this.state.percent}% done</div>
    );
  }

}

ReactDOM.render(
  <Hash />,
  document.getElementById('root')
);