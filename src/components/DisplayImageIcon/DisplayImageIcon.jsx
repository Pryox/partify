import React from 'react';

function DisplayImageIcon({url, width, height}) {
    return (
        <>
            {!!url && <img src={url} alt="" width={width} height={height} />}
        </>
    );
}

export default DisplayImageIcon;