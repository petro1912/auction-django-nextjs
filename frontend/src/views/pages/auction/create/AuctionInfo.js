// ** MUI Imports
import { useEffect, useState } from 'react';


import Box from '@mui/material/Box';
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import DatePicker from 'react-datepicker'
import CustomInput from 'src/views/pickers/PickersCustomInput';

const AuctionInfo = ({ period, updatePeriod }) => {
  const [time, setTime] = useState({
    started: new Date(),
    ended: new Date()
  });

  useEffect(() => {
    setTime(period);
  }, [period])


  return (
    <Card sx={{ mb: 2 }}>
      <CardHeader title='Auction Period' />
      <CardContent>
        <Box sx={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', m: 2
        }}>
          <Box sx={{ mr: 3 }}>
            <DatePicker
              showTimeSelect
              selected={time.started}
              id='started'
              dateFormat='MM/dd/yyyy h:mm'
              popperPlacement='bottom-start'
              onChange={date => updatePeriod(true, date)}
              customInput={<CustomInput label='Started at' />}
            />
          </Box>
          <Box>
            <DatePicker
              showTimeSelect
              selected={time.ended}
              id='ended'
              dateFormat='MM/dd/yyyy h:mm'
              popperPlacement='bottom-start'
              onChange={date => updatePeriod(false, date)}
              customInput={<CustomInput label='Ended at' />}
            />
          </Box>
        </Box>
      </CardContent>
    </Card>

  );

}

export default AuctionInfo;
