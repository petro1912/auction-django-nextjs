// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CustomTextField from 'src/@core/components/mui/text-field'
import Avatar from '@mui/material/Avatar'
import { parseISO, format } from 'date-fns';
import { useAuth } from 'src/hooks/useAuth'
import { useState } from 'react'
import { start } from 'nprogress'

const AuctionBids = ({ data, starting, highest, action }) => {

  const [bidPrice, setBidPrice] = useState();
  const [error, setError] = useState();
  const auth = useAuth();
  const list = data.sort((a, b) => b.price - a.price);

  const onChange = (e) => {
    setError(null);
    setBidPrice(e.target.value)
  }

  const placeBid = () => {
    console.log(starting, highest);
    if (bidPrice < starting) {
      setError("Price must be greater than Starting Price");

      return;
    } else if (highest && bidPrice < highest) {
      setError("Price must be greater than Highest Price");

      return;
    }

    action(bidPrice);
  }

  return (
    <Card>
      <CardHeader
        title='Auction Bids'
        subheader={`Total ${data.length} bid done in auction`}
      />
      <CardContent>
        {
          auth.user &&
          <>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'flex-start',
                mb: 3.5
              }}
            >
              <Typography sx={{ color: 'info' }}>Bid Price: </Typography>
              <CustomTextField
                sx={{ ml: 2 }}
                autoFocus
                value={bidPrice}
                onChange={onChange}
                placeholder='Bid Price'
              />
              <Button onClick={placeBid} variant='contained' color='info' sx={{ ml: 2 }}>
                Bid Now
              </Button>
            </Box>
            {
              error &&
              <Typography sx={{ color: '#ee0000', }}>{error}</Typography>
            }
          </>
        }
        {list.map((item, index) => {
          return (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: index !== list.length - 1 ? 3.5 : undefined
              }}
            >
              <Avatar
                alt={item.buyer.fullname}
                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${item.buyer.image}`}
                sx={{ width: 34, height: 34, mr: 2.75 }} />

              <Box
                sx={{
                  rowGap: 1,
                  columnGap: 4,
                  width: '100%',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Typography variant='h6'>{item.buyer.fullname}</Typography>
                  <Typography variant='body2' sx={{ color: 'text.disabled' }}>
                    {format(parseISO(item.created_at), 'MM-dd HH:mm')}
                  </Typography>
                </Box>
                <Typography
                  sx={{ fontWeight: 500, color: !item.is_highest ? 'error.main' : 'success.main' }}
                >
                  {`${item.price}`}
                </Typography>
              </Box>
            </Box>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default AuctionBids
