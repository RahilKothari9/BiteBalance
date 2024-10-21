import React from 'react'
import Today from '../components/Today'
import PrevThree from '../components/PrevThree'
import { UserAuth } from '../contexts/AuthContext'
import NutritionDashboard from '../components/NutritionDashboard'
const Stats = () => {
  const { user } = UserAuth()
  return (
    <div>
      {/* <Today userId={user.uid}/>
      <PrevThree userId={user.uid}/> */}
      <NutritionDashboard userId={user.uid} />
    </div>
  )
}

export default Stats