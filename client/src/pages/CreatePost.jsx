import React, { useRef, useState } from 'react'
import {Alert, Button, FileInput, Select, TextInput} from 'flowbite-react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';



const CreatePost = () => {
  const [file,setFile] = useState(null)
  const [imageUploadProgress,setImageUploadProgress] = useState(null);
  const [error,setError] = useState(null)
  const [formData,setFormData] = useState({})
  const handleImageUpload = async ( ) => {
    try {
      if(!file) {
        setError("select an image")
        return;
      }
      setError(null)
      const storage = getStorage(app);
       const fileName = new Date().getTime() + file.name;
       const storageRef = ref(storage,fileName)
       const uploadTask = uploadBytesResumable(storageRef,file);
       uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred/snapshot.totalBytes) *100;
          setImageUploadProgress(progress.toFixed(0))
        },
        (error) => {
          setError('Unable to upload,File may be less than 2MB'),
          setImageUploadProgress(null)
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setError(null)
            setFormData({...formData , image : downloadURL})
          })
        }
      )
    } catch (error) {
      setError("Error occured")
      setImageUploadProgress(null)
    }
  }

  const handlePublish = async () => {

  }

  return (
    <div  className='p-3 max-w-3xl mx-auto min-h-screen'>
        <h1 className='text-center text-3xl my-7 font-semibold'>Create a post</h1>
        <form  onSubmit={handlePublish} className='flex flex-col gap-4'>
          <div className=' flex flex-col sm:flex-row justify-between gap-4'>
           <TextInput type='text' placeholder='Title' required id='title'
            className='flex-1'
           />
           <Select>
             <option value="uncategorized">Select a category</option>
             <option value="javascript">Javascript</option>
             <option value="reactjs">React.js</option>
             <option value="nextjs">Next.js</option>
           </Select>
          </div>
          <div className='flex  gap-4 items-center justify-between p-3 border-4 border-dotted border-blue-400'>
            <FileInput type='file' accept='image/*' onChange={(e) => setFile(e.target.files[0])}/>
            <Button type='button' gradientDuoTone={'purpleToBlue'} size='sm' outline
            onClick={handleImageUpload}>
              {imageUploadProgress ? (
                <div className=' h-5 w-24'>
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
                </div>
          
         ) : "Upload Image"}
            </Button>
          </div>
          {error && (
            <Alert color={'failure'}>
              {error}
            </Alert>
          )}
          {formData.image && (
            <img src={formData.image} alt="image" className='w-full h-72 object-cover' />
          )}
           <ReactQuill theme="snow"  placeholder='Write something...' className='h-52 mb-12'  />
           <Button type='submit' gradientDuoTone={'purpleToPink'}>Publish</Button>
        </form>
    </div>
  )
}

export default CreatePost