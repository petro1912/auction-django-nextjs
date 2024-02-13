// ** MUI Imports
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'

// ** Third Party Components
import { useKeenSlider } from 'keen-slider/react'
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'

const AuctionSlider = ({ images }) => {
  // ** Hook
  const [ref] = useKeenSlider(
    {
      loop: true,
      rtl: false
    },
    [
      slider => {
        let mouseOver = false
        let timeout

        const clearNextTimeout = () => {
          clearTimeout(timeout)
        }

        const nextTimeout = () => {
          clearTimeout(timeout)
          if (mouseOver) return
          timeout = setTimeout(() => {
            slider.next()
          }, 2000)
        }
        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true
            clearNextTimeout()
          })
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false
            nextTimeout()
          })
          nextTimeout()
        })
        slider.on('dragStarted', clearNextTimeout)
        slider.on('animationEnded', nextTimeout)
        slider.on('updated', nextTimeout)
      }
    ]
  )

  return (
    <KeenSliderWrapper>
      <Card>
        <Box ref={ref} className='keen-slider'>
          {images.map((image, index) => {
            return (
              <Box key={`slider-image-${index}`} className='keen-slider__slide'>
                <img src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/media${image}`} alt='Slider Image' />
              </Box>
            )
          })}
        </Box>
      </Card>
    </KeenSliderWrapper>
  )
}

export default AuctionSlider
