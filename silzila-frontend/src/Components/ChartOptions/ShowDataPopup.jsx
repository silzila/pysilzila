import React from 'react';
//import  '../../styles/chartControls.css';




const _modifyData = (props)=>{
     if(props.remove){
        return props.data;
     }else{
         return props.data;
     }
}

const ConstructPopupHeader= (props)=>{
    return props.header ? <><h1>props.header</h1></> : null;
}

const ContructPopupBody = (props)=>{
 let _data = _modifyData(props);

 let _body = [];

 if(_data){
    Object.keys(_data).forEach(key=>{
        let _pair = <div><span className="ShowDataPopupKey">{key}</span><span>:</span><span className="ShowDataPopupValue">{_data[key]}</span></div>
        _body.push(_pair);
    });
 }

 return _body;
}


const getPosition = ({rect})=>{
    let _style = {};

    _style["top"] = rect.top + 50;
    _style["left"] = rect.left + 50;

    return _style;
}


const ShowDataPopup = (props) => {
return props.show ? <div className="ShowDataPopup" onClick={props.backdropClicked} style={getPosition(props)}>
{ContructPopupBody(props)}
</div> : null;
}

export default ShowDataPopup;