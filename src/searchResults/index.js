import React from 'react'
import { Grid} from '@material-ui/core';

const PreviousSearch = ({previousItems}) => {


    return <Grid>
        {previousItems.map(item=>
            <div>
                <button onClick={searchPrev} > {item}   </button> 
            </div>
        )}
    </Grid>

}
export default PreviousSearch