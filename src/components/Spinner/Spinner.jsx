import style from './spinner.module.css'
import PropTypes from 'prop-types'

Spinner.prototype = {
    size: PropTypes.number,
    color: PropTypes.string
  }
export default function Spinner({size,color}){
    return (
        <>
            <div className={style.loader} style={{fontSize: `${size}px`,color}}></div>
        </>
    )
}