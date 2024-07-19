import React from 'react';
import { InfoWindow } from '@react-google-maps/api';
import { Box, Typography, Avatar } from '@mui/material';
import '../Map.css';

const infoWindowStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: '0px',
    padding: '0px'
};

const closeButtonStyle = {
    marginLeft: '10px',
    cursor: 'pointer',
    marginRight: 'auto'
};

interface CustomInfoWindowProps {
    position: google.maps.LatLngLiteral;
    onCloseClick: () => void;
    userId: string;
    teamId: string;
    userImage: string;
}

const CustomInfoWindow: React.FC<CustomInfoWindowProps> = ({ position, onCloseClick, userId, teamId, userImage }) => {
  return (
    <InfoWindow
      position={position}
          options={{
              pixelOffset: new google.maps.Size(0, -20),
              disableAutoPan: true
          }}
      onCloseClick={onCloseClick}
    >
        <div className="custom-info-window" style={infoWindowStyle}>
            <Avatar src={`${process.env.PUBLIC_URL}${userImage}`} alt={userId} sx={{ mr: 1 }}>
              {userId.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="body2">{userId}</Typography>
              <Typography variant="caption">Team: {teamId}</Typography>
            </Box>
            <span style={closeButtonStyle} onClick={onCloseClick}>
                &times;
            </span>
        </div>
    </InfoWindow>
  );
};

export default CustomInfoWindow;
