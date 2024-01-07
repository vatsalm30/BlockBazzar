import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';

export default function TitlebarImageList({images, onIMGClick}) {
  const navigate = useNavigate()

  const onClickIMG = (tokenId) => {
    if(onIMGClick === "" || onIMGClick === "/") return
    console.log(tokenId)
    navigate(onIMGClick + tokenId)
  }

  return (
    <ImageList sx={{ width: 500, height: 450 }}>
      <ImageListItem key="Subheader" cols={2}>
      </ImageListItem>
      {images.map((item) => (
        <ImageListItem key={item.image.replace("ipfs://", "https://").replace("/blob", ".ipfs.dweb.link/blob")}>
          <img
            src={`${item.image.replace("ipfs://", "https://").replace("/blob", ".ipfs.dweb.link/blob")}?w=248&fit=crop&auto=format`}
            srcSet={`${item.image.replace("ipfs://", "https://").replace("/blob", ".ipfs.dweb.link/blob")}?w=248&fit=crop&auto=format&dpr=2 2x`}
            alt={item.name}
            loading="lazy"
            onClick={()=>onClickIMG(item.tokenId)}
            className='cta-image'
            draggable="false"
          />
          <ImageListItemBar
            title={item.name}
            subtitle={item.description}
            actionIcon={
              <IconButton
                sx={{ color: 'rgba(255, 255, 255, 0.54)' }}
                aria-label={`info about ${item.name}`}
              >
                <InfoIcon />
              </IconButton>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}