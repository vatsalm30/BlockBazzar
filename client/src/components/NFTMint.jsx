import {useState} from 'react'
import {NFTStorage} from 'nft.storage'
import {mintItems, getTokenCounter} from './Web3Client'
import { useNavigate } from 'react-router-dom'

export const NFTMint = () => {

    const navigate = useNavigate()

    const [nftImage, setNFTImage] = useState(new Blob())
    const [nftName, setNFTName] = useState("")
    const [nftDescr, setNFTDescr] = useState("")

    const NFT_STORAGE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEYyODM3YUM2MjJDYTk1NTBEQzBmODM0MWE5OGZGNkIzQUYwMWM3ODMiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3NTAwOTUzNTI0MywibmFtZSI6IlZhbWF6b24gSXBmcyBlbmNvZGluZyJ9.ry07HwNtVi4ciXthBL9HZgcr1kLaRy7PesrRfLeS0BI"
    async function storeNFT(_image, _name, _description, _tokenId) {
        // load the file from disk
        // const image = await fileFromPath(imagePath)
    
        // create a new NFTStorage client using our API key
        const nftstorage = new NFTStorage({ token: NFT_STORAGE_KEY })
        
        // call client.store, passing in the image & metadata

        return nftstorage.store({
          name: _name,
          image: _image,
          description: _description,
          tokenId: _tokenId
        }).then(nftIPFS => {
            MintNFT(nftIPFS.url)
            console.log(nftIPFS.url)
            return nftIPFS;
          })
        .catch(error => console.error(error));
    }

    const MintNFT = (nftURL) => {
        mintItems((2n**256n) - 1n, nftURL).then(tx => {
          console.log(tx)
          getTokenCounter().then(tokenId => {
            navigate("/product/"+tokenId)
          })
        }).catch(err => {console.log(err)})
      }

    async function handelSubmit(e){
        e.preventDefault()
        getTokenCounter().then(async (tokenId)=>{
          const mintresult = await storeNFT(nftImage, nftName, nftDescr, Number(window.BigInt(tokenId)+window.BigInt(1)))
    })

    }

    function dataURItoBlob(dataURI) {
        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], { type: 'image/png' });
      }

    const onGetImage = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
          var reader = new FileReader();
          reader.onload = function(event) {
              var imageBlob = dataURItoBlob(event.target.result);
              setNFTImage(imageBlob);
          };
          reader.readAsDataURL(selectedFile);
        }
      }
    const onGetName = (e) => {
      setNFTName(e.target.value)
    }
    const onGetDescr = (e) => {
      setNFTDescr(e.target.value)
    }
    return (
    <div>
        <form onSubmit={handelSubmit}>
        <input type="file" onChange={onGetImage} className='cta-file'/>
        <br></br>
       <label className='cta-label'>Name: </label>
        <input type="text" onChange={onGetName} className='cta-text'/>
        <br></br>
        {/* <label for="text" className="cta-label">Description</label> */}
        <label className='cta-label'>Description: </label>
        <input type="text" onChange={onGetDescr} className='cta-text'/>
        <br></br>
        <input type='Submit' value="Mint" className = "cta-button"/>
        </form>
    </div>
    )
}
