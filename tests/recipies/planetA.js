const ethers = require('ethers');
const { bufferToHex, ripemd160 } = require('ethereumjs-util');
const { Tx } = require('leap-core');

const { mine } = require('../../src/helpers');
const mintAndDeposit = require('../actions/mintAndDeposit');

const ERC1949 = require('../../build/contracts/build/contracts/ERC1949.json');
const ERC20 = require('../../build/contracts/build/contracts/NativeToken.json');

let earthCode = '608060405234801561001057600080fd5b50600436106100445760e060020a600035046394d615b58114610049578063d43491371461007d578063f67fcc4c14610144575b600080fd5b61007b6004803603608081101561005f57600080fd5b5080359060ff6020820135169060408101359060600135610170565b005b61007b600480360360c081101561009357600080fd5b813591602081013591810190606081016040820135602060020a8111156100b957600080fd5b8201836020820111156100cb57600080fd5b803590602001918460018302840111602060020a831117156100ec57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550508235935050600160a060020a036020830135811692604001351690506102eb565b61007b6004803603606081101561015a57600080fd5b5060ff813516906020810135906040013561088a565b604080516000815260208082018084523060a060020a890217905260ff8616828401526060820185905260808201849052915173af0939af286a35dbfab7ded7c777a5f6e8be26a89260019260a081810193601f1981019281900390910190855afa1580156101e3573d6000803e3d6000fd5b50505060206040510351600160a060020a0316141515610248576040805160e560020a62461bcd0281526020600482015260156024820152605b60020a740e6d2cedccae440c8decae640dcdee840dac2e8c6d02604482015290519081900360640190fd5b6040805160e060020a63a9059cbb02815273088f79464f9a4b6bfe9bc76b4388c1ee2b591d0d600482015260248101869052905173f64ffbc4a69631d327590f4151b79816a193a8c69163a9059cbb9160448083019260209291908290030181600087803b1580156102b957600080fd5b505af11580156102cd573d6000803e3d6000fd5b505050506040513d60208110156102e357600080fd5b505050505050565b6000829050600066038d7ea4c6800082600160a060020a03166337ebbc038a6040518263ffffffff1660e060020a0281526004018082815260200191505060206040518083038186803b15801561034157600080fd5b505afa158015610355573d6000803e3d6000fd5b505050506040513d602081101561036b57600080fd5b505163ffffffff9081169089160302905068015af1d78b58c400008111156103d3576040805160e560020a62461bcd0281526020600482015260106024820152608160020a6f34b73b30b634b21032b6b4b9b9b4b7b702604482015290519081900360640190fd5b6000731f89fb2199220a350287b162b9d0a330a2d2efad905080600160a060020a031663a9059cbb84600160a060020a0316636352211e8c6040518263ffffffff1660e060020a0281526004018082815260200191505060206040518083038186803b15801561044257600080fd5b505afa158015610456573d6000803e3d6000fd5b505050506040513d602081101561046c57600080fd5b505168015af1d78b58c40000670853a0d2313c00008602046040518363ffffffff1660e060020a0281526004018083600160a060020a0316600160a060020a0316815260200182815260200192505050602060405180830381600087803b1580156104d657600080fd5b505af11580156104ea573d6000803e3d6000fd5b505050506040513d602081101561050057600080fd5b50506040805160e160020a6331a9108f0281526004810188905290518591600160a060020a038085169263a9059cbb9291851691636352211e916024808301926020929190829003018186803b15801561055957600080fd5b505afa15801561056d573d6000803e3d6000fd5b505050506040513d602081101561058357600080fd5b505168015af1d78b58c40000670853a0d2313c00008702046040518363ffffffff1660e060020a0281526004018083600160a060020a0316600160a060020a0316815260200182815260200192505050602060405180830381600087803b1580156105ed57600080fd5b505af1158015610601573d6000803e3d6000fd5b505050506040513d602081101561061757600080fd5b505060405160e060020a6336c9c457028152600481018b8152602482018b90526060604483019081528a5160648401528a51600160a060020a038816936336c9c457938f938f938f9360840190602085019080838360005b8381101561068757818101518382015260200161066f565b50505050905090810190601f1680156106b45780820380516001836020036101000a031916815260200191505b50945050505050600060405180830381600087803b1580156106d557600080fd5b505af11580156106e9573d6000803e3d6000fd5b50505050600081600160a060020a03166337ebbc03896040518263ffffffff1660e060020a0281526004018082815260200191505060206040518083038186803b15801561073657600080fd5b505afa15801561074a573d6000803e3d6000fd5b505050506040513d602081101561076057600080fd5b50516040805160e060020a63a983d43f028152600481018b905266038d7ea4c680008704830160248201529051919250600160a060020a0384169163a983d43f9160448082019260009290919082900301818387803b1580156107c257600080fd5b505af11580156107d6573d6000803e3d6000fd5b50506040805160e060020a63a9059cbb02815273088f79464f9a4b6bfe9bc76b4388c1ee2b591d0d6004820152600288026024820152905173f64ffbc4a69631d327590f4151b79816a193a8c6935083925063a9059cbb916044808201926020929091908290030181600087803b15801561085057600080fd5b505af1158015610864573d6000803e3d6000fd5b505050506040513d602081101561087a57600080fd5b5050505050505050505050505050565b604080516000815260208082018084526001606060020a0319606060020a300216905260ff8616828401526060820185905260808201849052915173af0939af286a35dbfab7ded7c777a5f6e8be26a89260019260a080820193601f1981019281900390910190855afa158015610905573d6000803e3d6000fd5b50505060206040510351600160a060020a031614151561096a576040805160e560020a62461bcd0281526020600482015260156024820152605b60020a740e6d2cedccae440c8decae640dcdee840dac2e8c6d02604482015290519081900360640190fd5b6040805160e060020a6370a082310281523060048201819052915173f64ffbc4a69631d327590f4151b79816a193a8c692839263a9059cbb9284916370a08231916024808301926020929190829003018186803b1580156109ca57600080fd5b505afa1580156109de573d6000803e3d6000fd5b505050506040513d60208110156109f457600080fd5b50516040805160e060020a63ffffffff8616028152600160a060020a03909316600484015260248301919091525160448083019260209291908290030181600087803b1580156102b957600080fdfea165627a7a723058207a1e488a9179ae4f4f53903251a17ef4970889e7ddcafb0a335ebc79ae2100210029';

let airCode = '608060405234801561001057600080fd5b50600436106100445760e060020a60003504630aef446d8114610049578063c521fbac14610087578063f7c5823e1461012b575b600080fd5b6100856004803603608081101561005f57600080fd5b50803590600160a060020a036020820135811691604081013591606090910135166101e4565b005b6100856004803603602081101561009d57600080fd5b810190602081018135602060020a8111156100b757600080fd5b8201836020820111156100c957600080fd5b803590602001918460018302840111602060020a831117156100ea57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250929550610419945050505050565b6100856004803603606081101561014157600080fd5b813591600160a060020a0360208201351691810190606081016040820135602060020a81111561017057600080fd5b82018360208201111561018257600080fd5b803590602001918460018302840111602060020a831117156101a357600080fd5b91908080601f0160208091040260200160405190810160405280939291908181526020018383808284376000920191909152509295506105b9945050505050565b6000839050600081600160a060020a0316636352211e856040518263ffffffff1660e060020a0281526004018082815260200191505060206040518083038186803b15801561023257600080fd5b505afa158015610246573d6000803e3d6000fd5b505050506040513d602081101561025c57600080fd5b50516040805160e060020a6323b872dd028152600160a060020a0383166004820152306024820152604481018990529051919250731f89fb2199220a350287b162b9d0a330a2d2efad9182916323b872dd9160648083019260209291908290030181600087803b1580156102cf57600080fd5b505af11580156102e3573d6000803e3d6000fd5b505050506040513d60208110156102f957600080fd5b50506040805160e060020a6337ebbc03028152600481018790529051600091600160a060020a038616916337ebbc0391602480820192602092909190829003018186803b15801561034957600080fd5b505afa15801561035d573d6000803e3d6000fd5b505050506040513d602081101561037357600080fd5b50516040805160e060020a63a9059cbb028152600160a060020a038816600482015260108b026024820152905191925073f64ffbc4a69631d327590f4151b79816a193a8c691829163a9059cbb9160448083019260209291908290030181600087803b1580156103e257600080fd5b505af11580156103f6573d6000803e3d6000fd5b505050506040513d602081101561040c57600080fd5b5050505050505050505050565b600061043b6001606060020a0319606060020a3002168363ffffffff6106e816565b9050600160a060020a03811673af0939af286a35dbfab7ded7c777a5f6e8be26a8146104ac576040805160e560020a62461bcd0281526020600482015260156024820152605b60020a740e6d2cedccae440c8decae640dcdee840dac2e8c6d02604482015290519081900360640190fd5b6040805160e060020a6370a08231028152306004820152905173f64ffbc4a69631d327590f4151b79816a193a8c69160009183916370a08231916024808301926020929190829003018186803b15801561050557600080fd5b505afa158015610519573d6000803e3d6000fd5b505050506040513d602081101561052f57600080fd5b50516040805160e060020a63a9059cbb028152306004820152602481018390529051919250600160a060020a0384169163a9059cbb916044808201926020929091908290030181600087803b15801561058757600080fd5b505af115801561059b573d6000803e3d6000fd5b505050506040513d60208110156105b157600080fd5b505050505050565b60006105db6001606060020a0319606060020a3002168363ffffffff6106e816565b9050600160a060020a03811673af0939af286a35dbfab7ded7c777a5f6e8be26a81461064c576040805160e560020a62461bcd0281526020600482015260156024820152605b60020a740e6d2cedccae440c8decae640dcdee840dac2e8c6d02604482015290519081900360640190fd5b6040805160e060020a63a9059cbb028152600160a060020a038516600482015260248101869052905173f64ffbc4a69631d327590f4151b79816a193a8c691829163a9059cbb916044808201926020929091908290030181600087803b1580156106b557600080fd5b505af11580156106c9573d6000803e3d6000fd5b505050506040513d60208110156106df57600080fd5b50505050505050565b6000806000808451604114151561070557600093505050506107ba565b50505060208201516040830151606084015160001a601b60ff8216101561072a57601b015b8060ff16601b1415801561074257508060ff16601c14155b1561075357600093505050506107ba565b6040805160008152602080820180845289905260ff8416828401526060820186905260808201859052915160019260a0808401939192601f1981019281900390910190855afa1580156107aa573d6000803e3d6000fd5b5050506020604051035193505050505b9291505056fea165627a7a72305820ff2c1a5f5becc754bd90facfa8061989f3d3a9574cb67b0cab9973cee0703f060029';

function replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace.replace('0x', ''));
}

const mintPassport = async (countryToken, nstColor, minter, contracts) => {
  const res = await mine(countryToken.mintDelegate(minter, { gasLimit: 200000 }));
  let tokenId = res.events[0].args.tokenId.toHexString();
  
  await mine(countryToken.approve(contracts.exitHandler.address, tokenId));
  await mine(
    contracts.exitHandler.depositBySender(
      tokenId, nstColor,
      {
        gasLimit: 2000000,
      }
    )
  );
  return tokenId;
};

const deployAndRegisterToken = async (factory, type, contracts, name, symbol) => {
  let params = [{
    gasLimit: 1712388,
    gasPrice: 100000000000,
  }];
  if (type === 0) {
    params = [ name, symbol, 18, ...params];
  }
  const token = await factory.deploy(...params);
  await token.deployed();
  const data = contracts.exitHandler.interface.functions.registerToken.encode([token.address, type]);
  await mine(
    contracts.governance.propose(
      contracts.exitHandler.address, data,
      { gasLimit: 2000000, gasPrice: 100000000000 }
    )
  );  
  return token;
};

module.exports = async function(contracts, [node], accounts, wallet, plasmaWallet) {
  console.log('👨‍🍳 Applying recipe: planetA');
  const minter = accounts[0].addr;
  const minterPriv = accounts[0].privKey;

  // passports
  let factory = new ethers.ContractFactory(ERC1949.abi, ERC1949.bytecode, wallet);
  const countryToken = await deployAndRegisterToken(factory, 2, contracts);

  // tokens
  factory = new ethers.ContractFactory(ERC20.abi, ERC20.bytecode, wallet);
  const co2Token = await deployAndRegisterToken(factory, 0, contracts, 'CO2', 'CO2');
  const goellarsToken = await deployAndRegisterToken(factory, 0, contracts, 'Goellars', 'GOE');

  // finalize register tokens
  await mine(contracts.governance.finalize({ gasLimit: 1000000, gasPrice: 100000000000 }));

  // wait for colors to appear
  const getColors = () => node.provider.send('plasma_getColors', [false, false]);
  while ((await getColors()).length < 3) {
    await node.advanceUntilChange(wallet);
  }

  // read results
  const afterColors = await getColors();

  const leapColor = afterColors.length - 3;
  const co2Color = afterColors.length - 2;
  const goellarsColor = afterColors.length - 1;

  const nstAfterColors = (await node.provider.send('plasma_getColors', [false, true]));
  const nstColor = ((2 ** 14) + (2 ** 15)) + nstAfterColors.length;

  // minting and depositing passports
  const tokenIdA = await mintPassport(countryToken, nstColor, minter, contracts);
  const tokenIdB = await mintPassport(countryToken, nstColor, minter, contracts);

  // minting and depositing tokens
  const co2Amount = ethers.utils.parseEther('1000').toString();
  await mintAndDeposit(
    accounts[0], co2Amount, minter, 
    co2Token, co2Color, contracts.exitHandler, node, wallet, plasmaWallet
  );
  
  const goellarsAmount = ethers.utils.parseEther('200').toString();
  await mintAndDeposit(
    accounts[0], goellarsAmount, minter, 
    goellarsToken, goellarsColor, contracts.exitHandler, node, wallet, plasmaWallet
  );

  airCode = replaceAll(airCode, "1231111111111111111111111111111111111123", co2Token.address);
  airCode = replaceAll(airCode, "2341111111111111111111111111111111111234", goellarsToken.address);
  airCode = replaceAll(airCode, "5671111111111111111111111111111111111567", minter);
  const airAddr = bufferToHex(ripemd160(airCode));

  earthCode = replaceAll(earthCode, '1231111111111111111111111111111111111123', co2Token.address);
  earthCode = replaceAll(earthCode, '2341111111111111111111111111111111111234', goellarsToken.address);
  earthCode = replaceAll(earthCode, '4561111111111111111111111111111111111456', airAddr);
  earthCode = replaceAll(earthCode, "5671111111111111111111111111111111111567", minter);
  const earthAddr = bufferToHex(ripemd160(earthCode));

  let unspents = await node.getUnspent(minter, String(co2Color));

  // send CO2 to Earth
  // XXX: add support for approval in ERC1949
  let transferTx = Tx.transferFromUtxos(
    unspents, minter, earthAddr, co2Amount, co2Color
  ).signAll(minterPriv);
  await node.sendTx(transferTx);

  // send GOE to Earth
  unspents = await node.getUnspent(minter, String(goellarsColor));
  // XXX: add support for approval in ERC1949
  transferTx = Tx.transferFromUtxos(
    unspents, minter, earthAddr, goellarsAmount, goellarsColor
  ).signAll(minterPriv);
  await node.sendTx(transferTx);

  // send LEAP to Earth
  unspents = await node.getUnspent(minter, leapColor);
  transferTx = Tx.transferFromUtxos(
    unspents, minter, earthAddr, ethers.utils.parseEther('200').toString(), 0
  ).signAll(minterPriv);
  await node.sendTx(transferTx);

  console.log();
  console.log('LEAP: ', afterColors[leapColor], leapColor);
  console.log('CO2: ', afterColors[co2Color], co2Color);
  console.log('GOELLARS: ', afterColors[goellarsColor], goellarsColor);

  console.log('Passports: ', nstAfterColors[nstAfterColors.length - 1], nstColor);

  console.log('passportA', tokenIdA);
  console.log('passportB', tokenIdB);

  console.log('\nAir code: ', airCode);
  console.log('\nAir address: ', airAddr);

  console.log('\nEarth code: ', earthCode);
  console.log('\nEarth address: ', earthAddr);
  console.log('priv: ', minterPriv);
}
