import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Error(){
    return <>
        <div style={{display: 'flex',flexDirection:'column',alignItems:'center',marginTop:'100px'}}>
            <FontAwesomeIcon icon={faExclamationTriangle} size={'8x'} color='red' />
            <h2 style={{color:'red'}}>This page not found !!</h2>
        </div>
    </>
}