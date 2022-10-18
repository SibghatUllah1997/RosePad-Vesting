import logo from './assets/images/logo.svg';
import { Row, Col, Typography,Switch, Button, Image, } from 'antd';
import RoseImg from "./assets/images/Rose.svg";
import FooterLogo from "./assets/images/footer-logo.png";
import 'antd/dist/antd.css';
import "./assets/fonts/styles.css";
import './assets/scss/app.scss';
import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Alert,
  useDisclosure,

} from "@chakra-ui/react";
import SelectWalletModal from "./Modal";
import { useWeb3React } from "@web3-react/core";

import { networkParams } from "./networks";
import { connectors } from "./connectors";
import { toHex, truncateAddress } from "./utils";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ChainZeeperLogo from "./assets/images/chain-zeeper.png";
import LogoImage from "./assets/images/logo.png";
import DiscordImg from "./assets/images/discord.png";
import MediumImg from "./assets/images/medium.png";
import RedditImg from "./assets/images/reddit.png";
import TelegramImg from "./assets/images/telegram.png";
import Twitter from "./assets/images/twitter.png";
import AllocationImg from "./assets/images/allocation.png";
import AvailableImg from "./assets/images/available.png";
import ClaimedImg from "./assets/images/claimed.png";
import ClaimableImg from "./assets/images/claimable.png";
import Web3 from 'web3';
// import {BigNumber} from '@ethersproject/bignumber'

// import ABI from './pyrLavaPool1.json'
import { Contract } from '@ethersproject/contracts'


import { LockingABI, token_ABI, SeedContractAdd, P1ContractAdd, P2ContractAdd, StrategicContractAdd, KwickContractAdd, AdvisorContractAdd, VIPContractAdd } from './constants/info'

const {Title, Text, Link} = Typography;

function App() {

  const [showAllRounds, setShowAllRounds] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const web3 = new Web3(Web3.givenProvider || "https://emerald.oasis.dev");
  // "https://bsc-dataseed.binance.org/");//"https://data-seed-prebsc-2-s3.binance.org:8545"); //"https://rpc-mumbai.matic.today");
  let ABI = LockingABI()
  let SeedContract_Add = SeedContractAdd()//  '0x9bc6f03D77e935dDbec27725F64bA027f2d2CCf7'

  let StrategicContract_Add = StrategicContractAdd()  //'0x65AaEEEdEcA5F2c50F4057Bf5A54EF95396d26B2'

  let AdvisorContract_Add = AdvisorContractAdd()  //'0x65AaEEEdEcA5F2c50F4057Bf5A54EF95396d26B2'

  const SeedWeb3 = new web3.eth.Contract(ABI, SeedContract_Add)

  const StrategicWeb3 = new web3.eth.Contract(ABI, StrategicContract_Add)

  const AdvisorWeb3 = new web3.eth.Contract(ABI, AdvisorContract_Add)

  const {
    library,
    chainId,
    account,
    activate,
    deactivate,
    active
  } = useWeb3React();
  function getLibrary(provider) {
    return new Web3(provider)
  }
  console.log("library" + library)
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");
  const [network, setNetwork] = useState(undefined);
  const [message, setMessage] = useState("");
  
  const [signedMessage, setSignedMessage] = useState("");

  function getSigner(library, account) {
    return library.getSigner(account).connectUnchecked()
  }

  function getProviderOrSigner(library, account) {
    return account ? getSigner(library, account) : library
  }

  function getContract(address, ABI, library, account) {
    return new Contract(address, ABI, getProviderOrSigner(library, account))
  }

  function useContract(address, ABI, withSignerIfPossible = true) {
    return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined)

  }

  const refreshState = () => {
    window.localStorage.setItem("provider", undefined);
    // setNetwork("");
    setMessage("");
    setSignature("");
    // setVerified(undefined);
  };

  const disconnect = () => {
    refreshState();
    deactivate();

    getSeedAllocationAmnt(0)
    getSeedReleasedAmnt(0)
    getSeedAvailableAmnt(0)
    getSeedUnlockAmnt(0)

    getStrateAllocationAmnt(0)
    getStrateReleasedAmnt(0)
    getStrateAvailableAmnt(0)
    getStrateUnlockAmnt(0)

    getAdvisorAllocationAmnt(0)
    getAdvisorReleasedAmnt(0)
    getAdvisorAvailableAmnt(0)
    getAdvisorUnlockAmnt(0)

    getPrincipleAllocationAmnt(0)
    getPrincipleReleasedAmnt(0)
    getPrincipleAvailableAmnt(0)
    getPrincipleUnlockAmnt(0)
  };



  const [SeedAllocationAmnt, getSeedAllocationAmnt] = useState(null);
  const [SeedReleasedAmnt, getSeedReleasedAmnt] = useState('');
  const [SeedAvailableAmnt, getSeedAvailableAmnt] = useState('');
  const [SeedUnlockAmnt, getSeedUnlockAmnt] = useState('');

  const [StrateAllocationAmnt, getStrateAllocationAmnt] = useState('');
  const [StrateReleasedAmnt, getStrateReleasedAmnt] = useState('');
  const [StrateAvailableAmnt, getStrateAvailableAmnt] = useState('');
  const [StrateUnlockAmnt, getStrateUnlockAmnt] = useState('');

  const [AdvisorAllocationAmnt, getAdvisorAllocationAmnt] = useState('');
  const [AdvisorReleasedAmnt, getAdvisorReleasedAmnt] = useState('');
  const [AdvisorAvailableAmnt, getAdvisorAvailableAmnt] = useState('');
  const [AdvisorUnlockAmnt, getAdvisorUnlockAmnt] = useState('');

  const [PrincipleAllocationAmnt, getPrincipleAllocationAmnt] = useState('');
  const [PrincipleReleasedAmnt, getPrincipleReleasedAmnt] = useState('');
  const [PrincipleAvailableAmnt, getPrincipleAvailableAmnt] = useState('');
  const [PrincipleUnlockAmnt, getPrincipleUnlockAmnt] = useState('');

  const [UpdatedDislayBool, setUpdatedDislayBool] = useState('');


  function calculateContractValues() {
    if (account) {
      let principleReleaseAmnt = 0
      let principleUnlockAmnt = 0

      SeedWeb3.methods.lockedAmountOf(account).call(function (err, res) {
        if (err) {
          console.log("An error occured", err)
          return
        }

        //  alert(res)
        getSeedAllocationAmnt(web3.utils.fromWei(res.toString(), 'ether'))

        // getSeedAllocationAmnt(parseInt(res / 10 ** 18))

        console.log("Allocation amount: ", res)

        SeedWeb3.methods.releasedAmountOf(account).call(function (err, res1) {
          if (err) {
            console.log("An error occured", err)
            return
          }
          getSeedReleasedAmnt(web3.utils.fromWei(res1.toString(), 'ether'))
          // getSeedReleasedAmnt(parseInt(res1 / 10 ** 18))
          console.log("Allocation amount: ", res1)
          principleReleaseAmnt += parseInt(web3.utils.fromWei(res1.toString(), 'ether'))

          // principleReleaseAmnt += parseInt(res1 / 10 ** 18)
          let AvailableAmnt = parseInt(web3.utils.fromWei(res.toString(), 'ether')) - parseInt(web3.utils.fromWei(res1.toString(), 'ether'))
          //     getSeedAvailableAmnt(web3.utils.fromWei(AvailableAmnt.toString(), 'ether'))

          //   let AvailableAmnt = res-res1
          getSeedAvailableAmnt(AvailableAmnt)


          SeedWeb3.methods.canUnlockAmountOf(account).call(function (err, res1Unlock) {
            console.log("res1Unlock:" + res1Unlock)
            if (err) {
              console.log("An error occured", err)
              return
            }
            getSeedUnlockAmnt(web3.utils.fromWei(res1Unlock.toString(), 'ether'))
            //getSeedUnlockAmnt(parseInt(res1Unlock / 10 ** 18))


            principleUnlockAmnt = parseInt(web3.utils.fromWei(res1Unlock.toString(), 'ether'))
            //principleUnlockAmnt += parseInt(res1Unlock / 10 ** 18)

          })
        })









 









            StrategicWeb3.methods.lockedAmountOf(account).call(function (err, res6) {
              if (err) {
                console.log("An error occured", err)
                return
              }

              getStrateAllocationAmnt(web3.utils.fromWei(res6.toString(), 'ether'))
              //  getStrateAllocationAmnt(parseInt(res6 / 10 ** 18))
              console.log("Allocation amount: ", res6)


              StrategicWeb3.methods.releasedAmountOf(account).call(function (err, res7) {
                if (err) {
                  console.log("An error occured", err)
                  return
                }
                getStrateReleasedAmnt(web3.utils.fromWei(res7.toString(), 'ether'))
                //   getStrateReleasedAmnt(parseInt(res7 / 10 ** 18))
                console.log("Allocation amount: ", res7)

                principleReleaseAmnt += parseInt(web3.utils.fromWei(res7.toString(), 'ether'))









































                let AvailableAmnt = parseInt(web3.utils.fromWei(res6.toString(), 'ether')) - parseInt(web3.utils.fromWei(res7.toString(), 'ether'))
                getStrateAvailableAmnt(AvailableAmnt)



                //  let principleAllAmnt =  
                //   parseInt(web3.utils.fromWei(res.toString(), 'ether') ) +
                //   parseInt(web3.utils.fromWei(res2.toString(), 'ether') ) +
                //   parseInt(web3.utils.fromWei(res4.toString(), 'ether')) +
                //   parseInt(web3.utils.fromWei(res6.toString(), 'ether'))
                //   getPrincipleAllocationAmnt(principleAllAmnt)
                //   let PrincipleAvailableAmnt = principleAllAmnt - principleReleaseAmnt
                //   getPrincipleAvailableAmnt(parseInt(PrincipleAvailableAmnt))
                //   getPrincipleReleasedAmnt(principleReleaseAmnt)



                StrategicWeb3.methods.canUnlockAmountOf(account).call(function (err, res7Unlock) {
                  console.log("res7Unlock:" + res7Unlock)

                  if (err) {
                    console.log("An error occured", err)
                    return
                  }
                  getStrateUnlockAmnt(web3.utils.fromWei(res7Unlock.toString(), 'ether'))
                  //getStrateUnlockAmnt(parseInt(res7Unlock / 10 ** 18))


                  principleUnlockAmnt += parseInt(web3.utils.fromWei(res7Unlock.toString(), 'ether'))



////////////////////////////////////////////////////////////////////////////////////////////////////

AdvisorWeb3.methods.lockedAmountOf(account).call(function (err, resAdvisor) {
  if (err) {
    console.log("An error occured", err)
    return
  }

  //  alert(res)
  getAdvisorAllocationAmnt(web3.utils.fromWei(resAdvisor.toString(), 'ether'))

  // getSeedAllocationAmnt(parseInt(res / 10 ** 18))

  console.log("Allocation amount: ", resAdvisor)





AdvisorWeb3.methods.releasedAmountOf(account).call(function (err, res1AdvisorWeb3) {
  if (err) {
    console.log("An error occured", err)
    return
  }
  getAdvisorReleasedAmnt(web3.utils.fromWei(res1AdvisorWeb3.toString(), 'ether'))
  // getSeedReleasedAmnt(parseInt(res1 / 10 ** 18))
  console.log("Allocation amount: ", AdvisorWeb3)
  principleReleaseAmnt += parseInt(web3.utils.fromWei(res1AdvisorWeb3.toString(), 'ether'))

  // principleReleaseAmnt += parseInt(res1 / 10 ** 18)
  let AvailableAmnt = parseInt(web3.utils.fromWei(resAdvisor.toString(), 'ether')) - parseInt(web3.utils.fromWei(res1AdvisorWeb3.toString(), 'ether'))
  //     getSeedAvailableAmnt(web3.utils.fromWei(AvailableAmnt.toString(), 'ether'))

  //   let AvailableAmnt = res-res1
  getAdvisorAvailableAmnt(AvailableAmnt)


  AdvisorWeb3.methods.canUnlockAmountOf(account).call(function (err, res1UnlockAdvisorWeb3) {
    console.log("res1Unlock:" + res1UnlockAdvisorWeb3)
    if (err) {
      console.log("An error occured", err)
      return
    }
    getAdvisorUnlockAmnt(web3.utils.fromWei(res1UnlockAdvisorWeb3.toString(), 'ether'))
    //getSeedUnlockAmnt(parseInt(res1Unlock / 10 ** 18))


    principleUnlockAmnt += parseInt(web3.utils.fromWei(res1UnlockAdvisorWeb3.toString(), 'ether'))
    //principleUnlockAmnt += parseInt(res1Unlock / 10 ** 18)





   //////Principle cal///////////////////////////////////

   let principleAllAmnt =
   parseInt(web3.utils.fromWei(res.toString(), 'ether')) +

   parseInt(web3.utils.fromWei(res6.toString(), 'ether')) +

    parseInt(web3.utils.fromWei(resAdvisor.toString(), 'ether')) 
   // parseInt(web3.utils.fromWei(VIPres4.toString(), 'ether'))


   // let principleAllAmnt =
   // parseInt(web3.utils.fromWei(res.toString(), 'ether')) +
   
   // parseInt(web3.utils.fromWei(VIPres4.toString(), 'ether'))

 getPrincipleAllocationAmnt(principleAllAmnt)
 let PrincipleAvailableAmnt = principleAllAmnt - principleReleaseAmnt
 getPrincipleAvailableAmnt(parseInt(PrincipleAvailableAmnt))
 getPrincipleReleasedAmnt(principleReleaseAmnt)


 getPrincipleUnlockAmnt(principleUnlockAmnt) 

      //////Principle cal///////////////////////////////////
















  })
})
////////////////////////////////////////////////////////////////////////////////////////////////////



































               




             

           
                  // getPrincipleUnlockAmnt(web3.utils.fromWei(principleUnlockAmnt.toString(), 'ether'))


                  //   getPrincipleUnlockAmnt(principleUnlockAmnt)   // final lock amount



                  //  getPrincipleUnlockAmnt(Number(principleUnlockAmnt/10**18))

                })   //3rd 
              })   // 2nd







            })  //first

  })
      

        })


  


    }
  }


  
  useEffect(() => {
    const provider = window.localStorage.getItem("provider");
    //setNetwork(Number(id));
    // alert(web3.eth.getBalance(walletAddress))
    if (provider) activate(connectors[provider]);
    try {

      const intervalId = setInterval(() => {



        calculateContractValues()

        // pyrLavaPool1?.endJoin_date()
        // .then((result1) => {
        //   console.log("result1"+result1)
        //     setEndJoinDate_PYRLAVA_POOL1(result1)
        // })

      }, 3000)
      return () => clearInterval(intervalId); //This is important
    } catch (err) {

      // pyrLavaPool1?.endJoin_date()
      // .then((result1) => {
      //   console.log("result1"+result1)
      //     setEndJoinDate_PYRLAVA_POOL1(result1)
      // })
    }

  }, [3000]

  );

  calculateContractValues()


  const seedClaim = async () => {

    if (!library) return;
    try {
      let seedCall = useContract(SeedContract_Add, ABI, true)
      let estimate = seedCall.estimateGas.unlock

      let method = seedCall.unlock
      let args = [
        account
      ]

      let value = null

      await estimate(...args, value ? { value } : {})
        .then(estimatedGasLimit =>
          method(...args, {
            ...(value ? { value } : {}),
            //  gasLimit: calculateGasMargin(estimatedGasLimit)
          }).then(response => {
            // alert(response)
            setTimeout(calculateContractValues, 15000);
            toast.error(response, {

              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,


            })

          })
        )
        .catch(error => {
          toast.error(error.data.message, {

            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,


          })
          if (error?.code !== 4001) {
            console.error(error)
          }
        })

    } catch (error) {
      toast.error(error, {

        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,


      })
      setError(error);
    }
  };

  const strategicClaim = async () => {

    if (!library) return;
    try {
      let seedCall = useContract(StrategicContract_Add, ABI, true)
      let estimate = seedCall.estimateGas.unlock

      let method = seedCall.unlock
      let args = [
        account
      ]

      let value = null

      await estimate(...args, value ? { value } : {})
        .then(estimatedGasLimit =>
          method(...args, {
            ...(value ? { value } : {}),
            //  gasLimit: calculateGasMargin(estimatedGasLimit)
          }).then(response => {
            setTimeout(calculateContractValues, 15000);
            toast.error(response, {

              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,


            })

          })
        )
        .catch(error => {

          if (error?.code !== 4001) {
            console.error(error)
            toast.error(error.data.message, {

              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,


            })
          }
        })

    } catch (error) {
      toast.error(error, {

        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,


      })
      setError(error);
    }
  };


  const AdvisorClaim = async () => {

    if (!library) return;
    try {
      let AdvisorCall = useContract(AdvisorContract_Add, ABI, true)
      let estimate = AdvisorCall.estimateGas.unlock

      let method = AdvisorCall.unlock
      let args = [
        account
      ]

      let value = null

      await estimate(...args, value ? { value } : {})
        .then(estimatedGasLimit =>
          method(...args, {
            ...(value ? { value } : {}),
            //  gasLimit: calculateGasMargin(estimatedGasLimit)
          }).then(response => {
            // alert(response)
            setTimeout(calculateContractValues, 15000);
            toast.error(response, {

              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,


            })

          })
        )
        .catch(error => {
          toast.error(error.data.message, {

            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,


          })
          if (error?.code !== 4001) {
            console.error(error)
          }
        })

    } catch (error) {
      toast.error(error, {

        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,


      })
      setError(error);
    }
  };

  const statusDisplay = async () => {
    if (UpdatedDislayBool == false) {
      setUpdatedDislayBool(true)
      //  alert('true') 
    }
    else {
      setUpdatedDislayBool(false)
      //  alert('false')
    }
  }


  return (
    <>
       <ToastContainer style={{ width: "300px", fontSize: '14px' }}
        position="top-right"
        autoClose={false}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
     <div className="main-wrap">
        <div className="header">
            <img src={logo} alt="" />
            {/* <Button>0x123...4567</Button>    */}

            {!active ? (
            <Button className="headerBtn" onClick={onOpen}>{account ? `${truncateAddress(account)}` : 'CONNECT WALLET'} </Button>
            ) : (
            <Button  className="headerBtn"  onClick={disconnect}>{truncateAddress(account)} Disconnect</Button>
          )}

            {/* await web3Modal.clearCachedProvider() */}
            
        </div>
        <div className='banner-wrapper'>
          <h1>VESTING PORTAL</h1>
          {/* style={!showAllRounds?{color:'white'}:null} */}
          <div className="quantity-wrap" style={{color:'white'}}>
            <Row>
              <Col xs={24} sm={12} lg={6} xl={6}>
                <Title style={showAllRounds?{color:'white'}:null} level={2}>Allocation Amount</Title>
                <Title level={3}>{PrincipleAllocationAmnt ? PrincipleAllocationAmnt + ' RPAD' : " 0.00 "} </Title>
              </Col>
              <Col xs={24} sm={12} lg={6} xl={6}>
                <Title style={showAllRounds?{color:'white'}:null} level={2}>Available</Title>
                <Title level={3}>{PrincipleAvailableAmnt ? (PrincipleAvailableAmnt + ' RPAD') : " 0.00 " }</Title>
              </Col>
              <Col xs={24} sm={12} lg={6} xl={6}>
                <Title style={showAllRounds?{color:'white'}:null} level={2}>Claimed Amount</Title>
                <Title level={3}>{PrincipleReleasedAmnt ? (PrincipleReleasedAmnt + ' RPAD') : " 0.00 "} </Title>
              </Col>
              <Col xs={24} sm={12} lg={6} xl={6}>
                <Title style={showAllRounds?{color:'white'}:null} level={2}> Claimable Amount</Title>
                <Title level={3}>{PrincipleUnlockAmnt ? (PrincipleUnlockAmnt + ' RPAD') : " 0.00 "} </Title>
              </Col>
            </Row>
          </div>
        </div>
      </div>


      {UpdatedDislayBool == true ?
    <div className='rounds-wrap'>
      <Row gutter={16} className='round-boxes-wrap'>
        <Col span={24}>
          <Title level={2}>Rounds</Title>
          <div className="round-switch">
            <span>Invested Rounds</span>
            <Switch checked={showAllRounds} onClick={()=> {
          statusDisplay()
          setShowAllRounds(!showAllRounds)}}/>          {/* <Switch checked={showAllRounds} onClick={statusDisplay}/>  */}

          </div>
        </Col>


        {SeedAllocationAmnt > 0 ?
        <Col xs={24} sm={24} md={12} xl={12}>

          <div className="round-inr-box">
            <Image className="rose-img" width={50} height={50} src={RoseImg} alt="Rose" preview={false} />
            <div className="r-head">
            <Title level={4}>Private</Title>
            <Button type='primary' onClick={seedClaim}>Claim</Button>
            </div>
            <ul>
              <li>
           
                    
                <p>   Allocation Amount
                  <span>{SeedAllocationAmnt ? SeedAllocationAmnt.toString() + ' RPAD' : " 0.00 "} </span>
                </p>
                </li>
                <li>
                <p>   Available Amount
                  <span>{SeedAvailableAmnt ? SeedAvailableAmnt.toString() + ' RPAD' : " 0.00 "} </span>
                </p>
                </li>
                <li>
                <p>   Claimed Amount
                  <span>{SeedReleasedAmnt ? SeedReleasedAmnt.toString() + ' RPAD' : " 0.00 "} </span>
                </p>
                </li>
                <li>
                <p>   Claimable Amount
                  <span>{SeedUnlockAmnt ? SeedUnlockAmnt.toString() + ' RPAD' : " 0.00 "} </span>
                </p>
                </li>
            </ul>
          </div>
        </Col>
            :
            null

          }

       {StrateAllocationAmnt > 0 ?
        <Col xs={24} sm={24} md={12} xl={12}>
        <div className="round-inr-box">
        <Image className="rose-img" width={50} height={50} src={RoseImg} alt="Rose" preview={false} />
            
            
            
            
            <div className="r-head">
            <Title level={4}>Strategic</Title>
            <Button type='primary' onClick={strategicClaim}>Claim</Button>
            </div>
            <ul>
            <li>
           
                    
           <p>   Allocation Amount
             <span>{StrateAllocationAmnt ? StrateAllocationAmnt.toString() + ' RPAD' : " 0.00 "} </span>
           </p>
           </li>
           <li>
           <p>   Available Amount
             <span>{StrateAvailableAmnt ? StrateAvailableAmnt.toString() + ' RPAD' : " 0.00 "} </span>
           </p>
           </li>
           <li>
           <p>   Claimed Amount
             <span>{StrateReleasedAmnt ? StrateReleasedAmnt.toString() + ' RPAD' : " 0.00 "} </span>
           </p>
           </li>
           <li>
           <p>   Claimable Amount
             <span>{StrateUnlockAmnt ? StrateUnlockAmnt.toString() + ' RPAD' : " 0.00 "} </span>
           </p>
           </li>
            </ul>
          </div>
        </Col>
    :
    null

  }





{AdvisorAllocationAmnt > 0 ?
        <Col xs={24} sm={24} md={12} xl={12}>

          <div className="round-inr-box">
            <Image className="rose-img" width={50} height={50} src={RoseImg} alt="Rose" preview={false} />
            <div className="r-head">
            <Title level={4}>Public</Title>
            <Button type='primary' onClick={AdvisorClaim}>Claim</Button>
            </div>
            <ul>
              <li>
           
                    
                <p>   Allocation Amount
                  <span>{AdvisorAllocationAmnt ? AdvisorAllocationAmnt.toString() + ' RPAD' : " 0.00 "} </span>
                </p>
                </li>
                <li>
                <p>   Available Amount
                  <span>{AdvisorAvailableAmnt ? AdvisorAvailableAmnt.toString() + ' RPAD' : " 0.00 "} </span>
                </p>
                </li>
                <li>
                <p>   Claimed Amount
                  <span>{AdvisorReleasedAmnt ? AdvisorReleasedAmnt.toString() + ' RPAD' : " 0.00 "} </span>
                </p>
                </li>
                <li>
                <p>   Claimable Amount
                  <span>{AdvisorUnlockAmnt ? AdvisorUnlockAmnt.toString() + ' RPAD' : " 0.00 "} </span>
                </p>
                </li>
            </ul>
          </div>
        </Col>
            :
            null

          }



        {/* <Col xs={24} sm={24} md={12} xl={12}>
        <div className="round-inr-box">
        <Image className="rose-img" width={50} height={50} src={RoseImg} alt="Rose" preview={false} />
            <div className="r-head">
            <Title level={4}>Community/IDO</Title>
            <Button type='primary'>Claim</Button>
            </div>
            <ul>
              <li>
                <p>Total Allocation
                  <span>250 RPAD</span>
                </p>
                </li>
                <li>
                <p>Total Allocation
                  <span>250 RPAD</span>
                </p>
                </li>
                <li>
                <p>Total Allocation
                  <span>250 RPAD</span>
                </p>
                </li>
                <li>
                <p>Total Allocation
                  <span>250 RPAD</span>
                </p>
                </li>
            </ul>
          </div>
        </Col> */}
      </Row>
    </div>
   :
   <div className='rounds-wrap'>
      <Row gutter={16} className='round-boxes-wrap'>
        <Col span={24}>
          <Title level={2}>Rounds</Title>
          <div className="round-switch">
            <span>Invested Rounds</span>
         <Switch checked={showAllRounds} onClick={()=> {
          statusDisplay()
          setShowAllRounds(!showAllRounds)}}/>
          {/* <Switch checked={showAllRounds} onClick={statusDisplay}/>  */}

          </div>
        </Col>

        <Col xs={24} sm={24} md={12} xl={12}>

<div className="round-inr-box">
  <Image className="rose-img" width={50} height={50} src={RoseImg} alt="Rose" preview={false} />
  <div className="r-head">
  <Title level={4}>Private</Title>
  <Button type='primary' onClick={seedClaim}>Claim</Button>
  </div>
  <ul>
    <li>
 
          
      <p>   Allocation Amount
        <span>{SeedAllocationAmnt ? SeedAllocationAmnt.toString() + ' RPAD' : " 0.00 "} </span>
      </p>
      </li>
      <li>
      <p>   Available Amount
        <span>{SeedAvailableAmnt ? SeedAvailableAmnt.toString() + ' RPAD' : " 0.00 "} </span>
      </p>
      </li>
      <li>
      <p>   Claimed Amount
        <span>{SeedReleasedAmnt ? SeedReleasedAmnt.toString() + ' RPAD' : " 0.00 "} </span>
      </p>
      </li>
      <li>
      <p>   Claimable Amount
        <span>{SeedUnlockAmnt ? SeedUnlockAmnt.toString() + ' RPAD' : " 0.00 "} </span>
      </p>
      </li>
  </ul>
</div>
</Col>

<Col xs={24} sm={24} md={12} xl={12}>
        <div className="round-inr-box">
        <Image className="rose-img" width={50} height={50} src={RoseImg} alt="Rose" preview={false} />
            <div className="r-head">
            <Title level={4}>Strategic</Title>
            <Button type='primary' onClick={strategicClaim}>Claim</Button>
            </div>
            <ul>
            <li>
           
                    
           <p>   Allocation Amount
             <span>{StrateAllocationAmnt ? StrateAllocationAmnt.toString() + ' RPAD' : " 0.00 "} </span>
           </p>
           </li>
           <li>
           <p>   Available Amount
             <span>{StrateAvailableAmnt ? StrateAvailableAmnt.toString() + ' RPAD' : " 0.00 "} </span>
           </p>
           </li>
           <li>
           <p>   Claimed Amount
             <span>{StrateReleasedAmnt ? StrateReleasedAmnt.toString() + ' RPAD' : " 0.00 "} </span>
           </p>
           </li>
           <li>
           <p>   Claimable Amount
             <span>{StrateUnlockAmnt ? StrateUnlockAmnt.toString() + ' RPAD' : " 0.00 "} </span>
           </p>
           </li>
            </ul>
          </div>
        </Col>



        <Col xs={24} sm={24} md={12} xl={12}>

<div className="round-inr-box">
  <Image className="rose-img" width={50} height={50} src={RoseImg} alt="Rose" preview={false} />
  <div className="r-head">
  <Title level={4}>Public</Title>
  <Button type='primary' onClick={AdvisorClaim}>Claim</Button>
  </div>
  <ul>
    <li>
 
          
      <p>   Allocation Amount
        <span>{AdvisorAllocationAmnt ? AdvisorAllocationAmnt.toString() + ' RPAD' : " 0.00 "} </span>
      </p>
      </li>
      <li>
      <p>   Available Amount
        <span>{AdvisorAvailableAmnt ? AdvisorAvailableAmnt.toString() + ' RPAD' : " 0.00 "} </span>
      </p>
      </li>
      <li>
      <p>   Claimed Amount
        <span>{AdvisorReleasedAmnt ? AdvisorReleasedAmnt.toString() + ' RPAD' : " 0.00 "} </span>
      </p>
      </li>
      <li>
      <p>   Claimable Amount
        <span>{AdvisorUnlockAmnt ? AdvisorUnlockAmnt.toString() + ' RPAD' : " 0.00 "} </span>
      </p>
      </li>
  </ul>
</div>
</Col>
        </Row>
    </div>
 
      }
   
   <div className='powered-by-wrap'>
    <div>
    <Text className='power-text'>powered by</Text>
    <a href="https://chainzeeper.io" target="_blank"><Image src={ChainZeeperLogo} prefix={false} preview={false} width={150} ></Image></a>
    </div>
   </div>
  
    <div className="footer">
      <div className="wrap">
        <Row>
          <Col xs={24} sm={24} md={16} xl={16}>
        <Image src={FooterLogo} preview={false} />
        <Text>To help incubate and launch credible and successful projects on Oasis that brings real impact and value to the communities while bringing mass adoption to Oasis blockchain for long-term success.</Text>
          </Col>
          <Col xs={24} sm={24} md={4} xl={4}>
            <ul>
              <li><Link href="#">Home</Link></li>
              <li><Link href="#">Token flow</Link></li>
              <li><Link href="#">Roadmap</Link></li>
              <li><Link href="#">Launch App</Link></li>
            </ul>
          </Col>
          <Col xs={24} sm={24} md={4} xl={4}>
          <ul>
              <li><Link href="#">Terms of Service</Link></li>
              <li><Link href="#">Privacy Policy</Link></li>
            </ul>
          </Col>
        </Row>
      </div>
    </div>
    <SelectWalletModal isOpen={isOpen} closeModal={onClose} />
    </>
  );
}

export default App;
