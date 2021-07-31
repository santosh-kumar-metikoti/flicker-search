import React,{useState,useEffect} from 'react';
import { Dialog,DialogTitle,DialogContent,DialogActions, useMediaQuery,makeStyles ,ClickAwayListener , Grid,Paper, IconButton, Tooltip, Typography,TextField,Button ,InputAdornment} from '@material-ui/core';
// import { useStyles } from './style';
import axios from 'axios';
import Close from '@material-ui/icons/Close';
import { IndeterminateCheckBox } from '@material-ui/icons';
import Loader from './../loader/loader.container';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
  }
}));

var tempSearchKey = ""
var scrollONce = false
var imgArray = []

const ImageComponent = () => {
    const classes = useStyles();

    const maxWidth600 = useMediaQuery('(max-width:600px)');
    const maxWidth750 = useMediaQuery('(max-width:750px)');

    const [imgData, setImgData] = useState([]);
    const [loading,setLoading] = useState(true) 
    const [searchKey,setSearchKey] = useState("")
    const [pageNum,setPageNum] = useState(1)
    const [showPrevisSearches,setShowPreviousSearches] = useState(false)
    const [previousItems,setPreviousItems] = useState([])
    let previousSearchList = JSON?.parse(localStorage.getItem('previousSearches'))!==null? JSON?.parse(localStorage.getItem('previousSearches')).filter(item=>item!==""):[]
    const [popUpImage,setPopUpImage] = useState('')
    const [open,setOpen] = useState(false)
    const [apiCallOnScroll,setApiCallOnScroll] = useState(false)

    // let currentRowName = JSON.parse(localStorage.getItem('currentRowName'))

    const handlePopUp = (index) => {
        setOpen(true)
        setPopUpImage(index)
    }

    function handleScroll() {
         if (
           !scrollONce &&  parseInt((Math.ceil(window.innerHeight + document.documentElement.scrollTop)/document.documentElement.offsetHeight)*100) >80 && tempSearchKey.length>0
        ) {

             setPageNum(pageNum + 1);
             getImage(tempSearchKey,pageNum+1)
             setApiCallOnScroll(true)
             scrollONce=true
        }
        
    }

    useEffect(()=>{
      window.addEventListener('scroll', handleScroll);    
  

        var header = document.getElementById('myHeader');
        var sticky = header && header?.offsetTop;

        function myFunction() {
            if (window.pageYOffset > sticky) {
                header.style.position = 'fixed';
                header.style.marginTop = '-20px';
                header.style.width = '97%';
                header.style.zIndex = '100';
            } else {
                header.style.position = 'static';
                header.style.marginTop = 'unset';
                header.style.width = 'unset';
                header.style.zIndex = 'unset';
            }
        }
      getImage(undefined,undefined,true)
    return () => window.removeEventListener('scroll', handleScroll);
    },[])



    const getImage = async (text,page,initial) => {
    
    const initialUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&api_key='+"2c2e46f9efd672ab47251cc5ec909606"+'&format=json&nojsoncallback=1'
    const searchUrl = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key='+"2c2e46f9efd672ab47251cc5ec909606"+'&tags='+text+'&per_page=10000&page='+page+'&format=json&nojsoncallback=1'
    
    const response  = await axios.get(initial?initialUrl:searchUrl)
    
    if(response?.status===200 && response?.data?.stat?.toLowerCase()==="ok"){
        let {data} = response;
        let picsArrays = data.photos.photo
        setLoading(false)
        setShowPreviousSearches(false)
        if(imgArray.length>0){
            let tempImgArray = [...imgArray,...picsArrays]
            imgArray= tempImgArray
            setImgData(tempImgArray)
            scrollONce=false
        }else{
             setImgData(picsArrays)
             imgArray= picsArrays
        }
       
    }
    };

    console.log(imgData.length)

    const handleChange = (e)=> {
        setSearchKey(e)
        tempSearchKey=e
    }

    useEffect(()=>{
        if(searchKey.length>0){
            setLoading(true)
            imgArray=[]
            setImgData([])
            getImage(searchKey,1)
        }else{
            imgArray=[]
            setImgData([])
        }
       
    },[searchKey])

    const noResults = <Typography variant="h4" style={{margin:15,height:700}} align="center">
        {searchKey?"loading...":"NO Results"}
    </Typography>

    const handleClear = () => {
        if(imgData.length>0){
            if(previousSearchList?.length>0 && searchKey!==""){
                localStorage.setItem('previousSearches', JSON.stringify([...previousSearchList.filter(item=>item!==searchKey),searchKey]));
            }else if(searchKey!==""){
                localStorage.setItem('previousSearches', JSON.stringify([searchKey]));
            }
        }
        window.scrollTo(0, 0)
        setSearchKey("")
        imgArray=[]
        setImgData([])
        getImage(undefined,undefined,true)
    }

    const searchPrev = (item) => {
        setLoading(true)
        imgArray=[]
        setImgData([])
        setSearchKey(item)
        tempSearchKey=item
        setShowPreviousSearches(false)
    }

    const handleClose = () => {
        setOpen(false)
    }
 
    const handleClickAway = (e) => {
        if(e.target.name!=="input"){
            setShowPreviousSearches(false)
        }
    }

    const handleClearSearches = () => {
        setShowPreviousSearches(false)
        localStorage.setItem('previousSearches', JSON.stringify([]));
    }

    const ImageComponent = ({pic}) => {
         var srcPath = 'https://farm'+pic.farm+'.staticflickr.com/'+pic.server+'/'+pic.id+'_'+pic.secret+'.jpg';
        if(pic.farm===0){
           srcPath = 'https://farm'+66+'.staticflickr.com/'+pic.server+'/'+pic.id+'_'+pic.secret+'.jpg';
        }
        return(
            <Grid style={{ margin:10, cursor:"pointer"}} xs={12} md={6} lg={4} >
                <img alt="loading..." onClick={()=>handlePopUp(srcPath)}  src={srcPath} width={maxWidth750?"250px":"350px"} height={maxWidth750?"200px":"250px"}/>
            </Grid>
        )
    }

    return (
        <Grid xs={12}>
            <Grid  style={{backgroundColor:"black",height:"100px",width:"100%",paddingTop:20,position:'sticky',top:0}}>           
                <Grid>
                    <Typography style={{color:"white",marginBottom:5}} variant="h4">Search Photos</Typography>
                </Grid>  
                <Grid>
                    <TextField 
                        name="input"
                        size="small"
                        value={searchKey} 
                        variant="outlined"
                        onChange={(e)=>handleChange(e.target.value)} 
                        style={{width:"500px",paddingLeft:5}} 
                        InputProps={{
                            endAdornment: (
                                <InputAdornment>
                                    {searchKey && (
                                        <IconButton onClick={() => handleClear("")}>
                                            <Close />
                                        </IconButton>
                                    )}
                            
                                </InputAdornment>
                            ),
                            style:{
                                backgroundColor:"white"
                            }
                        }}
                        onFocus={()=>setShowPreviousSearches(true)}
                    />
                </Grid>
            </Grid> 
            {showPrevisSearches && previousSearchList.length>0 &&
                <ClickAwayListener onClickAway={handleClickAway}>
                    <div className={classes.root}>
                        <Paper  elivation={3} style={{ position:'fixed',top:'109px',left:'33.7%',backgroundColor:"white",marginTop:-13,padding:5,zIndex:10,width:490,align:'center',margin:"auto"}}>
                            {previousSearchList && previousSearchList.length>0 && previousSearchList.map((item,index)=>
                                <Grid key={index} className="intelDispl" style={{display:"flex",flexDirection:"row", paddingLeft:25,}}>
                                    <button onClick={()=>searchPrev(item)}  style={{cursor:'pointer',fontSize:20,color:"black",backgroundColor:"white" , outline:"none", border:"none", }}> {item}   </button> 
                                </Grid>
                            )}
                            <Grid style={{display:"flex",flexDirection:"row-reverse"}}>
                                <button onClick={handleClearSearches} style={{backgroundColor:"orangered",border:"none",outline:"none",color:"white",borderRadius:'5px'}}> Clear  </button> 
                            </Grid>
                        </Paper>
                    </div>
                </ClickAwayListener>
            }
            {loading?
            <div style={{height:700}}>
                <Loader/>
            </div>
            :imgData.length>0?
             <Grid id = 'myHeader'  xs={12}  style={{display:"grid", gridTemplateColumns:maxWidth600?"80%":maxWidth750?"45% 45%":"33.33% 33.33% 33.33%" , gridGap: 10, marginTop:20, padding:100,paddingTop:0}}>
                {imgData.map((item,index)=> <ImageComponent pic={item} key={index}/>)}
            </Grid>
            :<Grid>
                {noResults}
            </Grid>}
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogTitle id="alert-dialog-slide-title">{"Preview"}</DialogTitle>
                <DialogContent>
                     <img alt="dogs"  src={popUpImage} width="550px" height="350px"/>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose} color="primary">
                    close
                </Button>
                </DialogActions>
            </Dialog>  
           
        </Grid>
    );
};

export default ImageComponent;
