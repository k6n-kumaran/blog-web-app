import { Alert, Button, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import {useSelector} from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const DashboardProfile = () => {


  const {currentUser} = useSelector((state) => state.user)
  const [imageFile,setImageFile] = useState(null)
  const [imageURL,setImageURL] = useState(null)
  const [imageUploadProgress,setImageUploadProgress] = useState(null)
  const [error, setError] = useState(null)
  const fileChooseRef = useRef();


  const handlePicChange = (e) => {
    const file = e.target.files[0];

    if(file) {
      setImageFile(file)
      setImageURL(URL.createObjectURL(file))
    }
    
  }

  const uploadImage =  async() => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write:if
    //       request.resource.size < 2 * 1024 * 1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }

    setError(null)
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage,fileName)
    const uploadTask = uploadBytesResumable(storageRef,imageFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred/snapshot.totalBytes) *100;
        setImageUploadProgress(progress.toFixed(0))
      },
      (error) => {
        setError('Unable to upload,File may be less than 2MB'),
        setImageUploadProgress(null)
        setImageFile(null)
        setImageURL(null)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageURL(downloadURL)
        })
      }
    )
    
  }

  useEffect(() => {
    if(imageFile) {
      uploadImage();
    }
  },[imageFile])
  
  return (
    <div className='   mx-auto p-3 w-full'>
      <h1 className=' my-7 text-center font-semibold text-3xl'>Profile</h1>
      <form className='flex flex-col gap-2'>
        <input type="file" accept='image/*' onChange={handlePicChange} ref={fileChooseRef} hidden/>
        <div className=" relative w-32 h-32 self-center rounded-full overflow-hidden shadow-md cursor-pointer" onClick={()=> fileChooseRef.current.click()}>
         {imageUploadProgress && (
          <CircularProgressbar  value={imageUploadProgress} text={`${imageUploadProgress}%`}
            strokeWidth={5}
            styles={{
              root :{
                width : '100%',
                height : '100%',
                position : 'absolute',
                top:0,
                left : 0
              },
              path : {
                stroke : `rgba(62,152,199), ${imageUploadProgress/100}`
              }
            }}
          />
         )}
         <img src={imageURL ||  currentUser.photo} alt="user image" className='rounded-full w-full h-full object-cover border-8 border-[lightgray]' /> 
        </div>
        {error && 
            <Alert color='failure'>
            {error}
          </Alert>
         }
        <TextInput type='text'   id='username' defaultValue={currentUser.username}/>
        <TextInput type='email'  id='email' defaultValue={currentUser.email}/>
        <TextInput type='password' placeholder='password'  id='password'/>
        <Button type='submit' gradientDuoTone={'purpleToBlue'} outline>Update</Button>
      </form>
      <div className='text-red-500 flex justify-between mt-4'>
        <span className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign out</span>
      </div>
    </div>
  )
}

export default DashboardProfile