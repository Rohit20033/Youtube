import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './homePage'
import SingleVideoPage from './singlePageVideo'

function AllRoutes() {
  return (
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/single/:videoId' element={<SingleVideoPage/>}/>
    </Routes>
  )
}

export default AllRoutes