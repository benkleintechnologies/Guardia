import React from 'react';
import { InfoWindow } from '@react-google-maps/api';
import { Box, Typography } from '@mui/material';
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
}

const CustomInfoWindow: React.FC<CustomInfoWindowProps> = ({ position, onCloseClick, userId, teamId }) => {
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
