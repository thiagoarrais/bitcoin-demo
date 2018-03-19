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
    const targetNonce = 2999858432;
    this.nonce = -1;
    this.state = {percent: 0, nonce: 0, targetNonce};
  }
  
  componentDidMount() {
    this.timerID = setInterval(
      () => this.tick(),
      0
    );
    const startDate = new Date();
    this.startDate = startDate;
    this.setState({startDate: startDate.toString()});
  }
  
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.nonce = this.nonce + 1;
    this.targetNonce = 2999858432;
    
    const hash = blockhash(blockdb[1], this.nonce);
    
    const hashesPerSecond = this.nonce / (Date.now() - this.startDate) * 1000;
    const previsao = new Date(this.startDate.getTime() + (hashesPerSecond / 1000 * (this.targetNonce - this.nonce)));
    
    if (this.nonce >= this.targetNonce) {
      clearInterval(this.timerID);
    }
    
    const percent = Math.floor(this.nonce / this.targetNonce * 100);
    this.setState({
      nonce: this.nonce,
      previsao: previsao.toString(),
      hashesPerSecond,
      percent,
      hash,
    });
  }
  
  render() {
    return (
      <div>
        <div>{this.state.startDate}</div>
        <div>{this.state.percent}% concluido</div>
        <div>{this.state.nonce} => {this.state.targetNonce}</div>
        <div>H/S: {this.state.hashesPerSecond}</div>
        <div>Previsão: {this.state.previsao}</div>
        <div>{this.state.hash}</div>
      </div>
    );
  }

}

ReactDOM.render(
  <Hash />,
  document.getElementById('root')
);