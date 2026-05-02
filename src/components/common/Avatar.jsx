import React, { useState } from 'react';

const Avatar = ({ 
    src, 
    fallback, 
    fallbackBg = 'bg-violet-500', 
    size = 'w-14 h-14', 
    textSize = 'text-xl', 
    rounded = 'rounded-2xl', 
    extra = '' 
}) => {
    const [imgError, setImgError] = useState(false);

    if (src && !imgError) {
        return (
            <img
                src={src}
                alt="avatar"
                onError={() => setImgError(true)}
                className={`${size} ${rounded} object-cover shadow-md shrink-0 ${extra}`}
            />
        );
    }

    return (
        <div className={`${size} ${rounded} ${fallbackBg} text-white flex items-center justify-center font-extrabold ${textSize} shadow-md shrink-0 ${extra}`}>
            {fallback}
        </div>
    );
};

export default Avatar;
