import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import {HiOutlineExclamationCircle} from 'react-icons/hi'
import React, { useEffect, useRef, useState } from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {updateFailure,updateStart,updateSuccess ,deleteUserFailure,deleteUserStart,deleteUserSuccess} from '../app/slice/userSlice.js'

const DashboardProfile = () => {


  const {currentUser,error} = useSelector((state) => state.user)
  const [imageFile,setImageFile] = useState(null)
  const [imageURL,setImageURL] = useState(null)
  const [imageUploadProgress,setImageUploadProgress] = useState(null)
  const [errorE, setError] = useState(null)
  const [showModel,setShowModel] = useState(false)

  const [formData,setFormData] = useState({})
  const fileChooseRef = useRef();
  const dispatch = useDispatch();


  const handlePicChange = (e) => {
    const file = e.target.files[0];

    if(file) {
      setImageFile(file)
      setImageURL(URL.createObjectURL(file))
    }
    
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id] : e.target.value})
    console.log(formData);
    
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(Object.keys(formData).length ===0) {
      return;
    }

    try {
      dispatch(updateStart());
      
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method : "PUT",
        headers : {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json();

      if(!res.ok) {
        dispatch(updateFailure(data.message))
      } else{
        dispatch(updateSuccess(data))
      }
    } catch (error) {
      dispatch(updateFailure(error.message))
    }
  }

  const handleDelete = async() => {
    setShowModel(false)
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method : "DELETE"
      })
      const data = await res.json();
      if(!res.ok) {
        dispatch(deleteUserFailure(data.message))
      } else{
        dispatch(deleteUserSuccess(data))
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message))
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
          setFormData({...formData , photo : downloadURL})
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
      <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
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
        {errorE && 
            <Alert color='failure'>
            {errorE}
          </Alert>
         }
        <TextInput type='text'   id='username' defaultValue={currentUser.username} onChange={handleChange}/>
        <TextInput type='email'  id='email' defaultValue={currentUser.email} onChange={handleChange}/>
        <TextInput type='password' placeholder='password'  id='password' onChange={handleChange}/>
        <Button type='submit' gradientDuoTone={'purpleToBlue'} outline>Update</Button>
      </form>
      <div className='text-red-500 flex justify-between mt-4'>
        <span onClick={() =>  setShowModel(true)} className='cursor-pointer'>Delete Account</span>
        <span className='cursor-pointer'>Sign out</span>
      </div>
      {error && (
        <Alert color={'failure'} className='mt-5' >
          {error}
        </Alert>
      )}

      <Modal show={showModel} onClose={() => setShowModel(false)} popup size={'md'}>
        <Modal.Header/>
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className=' h-14 w-14 mx-auto text-gray-400 dark:text-green-200 mt-4' />
            <h3 className='text-md mb-5 text-gray-400 dark:text-gray-200'>Are you sure to delete your account?</h3>
            <div className='flex justify-between'>
              <Button color={'failure'} onClick={handleDelete}>
                Yes,I'm sure
              </Button>
              <Button color={'gray'} onClick={() => setShowModel(false)}>
                No,Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default DashboardProfile