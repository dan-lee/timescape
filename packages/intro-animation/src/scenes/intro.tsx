import { Layout, makeScene2D, Node, Rect, Txt } from '@motion-canvas/2d'
import {
  all,
  createRef,
  delay,
  easeInOutElastic,
  easeInOutQuad,
  easeInSine,
  linear,
  loopFor,
  useRandom,
  Vector2,
  waitFor,
} from '@motion-canvas/core'
import { CameraView } from '@ksassnowski/motion-canvas-camera'
import dayjs from 'dayjs'

// eslint-disable-next-line react-refresh/only-export-components
export default makeScene2D(function* (view) {
  view.fontFamily('Courier')

  const camera = createRef<CameraView>()
  const selected = createRef<Rect>()
  const layout = createRef<Layout>()
  const background = createRef<Rect>()

  const txtDays = createRef<Txt>()
  const txtMonths = createRef<Txt>()
  const txtYears = createRef<Txt>()
  const txtHours = createRef<Txt>()
  const txtMinutes = createRef<Txt>()
  const txtSeconds = createRef<Txt>()
  const txtAmPm = createRef<Txt>()
  const secondSeparator = createRef<Txt>()

  const random = useRandom(21534)

  const highlightColor = '#35b66b'
  const separatorColor = '#b2b2b2'
  const selectedPadding = 12

  let hour12 = false
  let date = dayjs(new Date('2023-01-01 00:00:00'))

  const updateDateRefs = () => {
    txtDays().text(date.format('DD'))
    txtMonths().text(date.format('MM'))
    txtYears().text(date.format('YYYY'))
    txtHours().text(!hour12 ? date.format('HH') : date.format('hh'))
    txtMinutes().text(date.format('mm'))
    txtSeconds().text(date.format('ss'))
    txtAmPm().text(date.format('A'))
  }

  yield view.add(
    <Node>
      <CameraView ref={camera} width="100%" height="100%" opacity={0}>
        <Rect
          width={700}
          height={94}
          fill="white"
          position={[90, 0]}
          ref={background}
          stroke="white"
          lineWidth={5.5}
          radius={20}
          smoothCorners
        />
        <Rect
          width={420}
          height={48}
          position={[0, 2]}
          gap={8}
          ref={layout}
          layout
          alignItems="center"
        >
          <Rect
            layout={false}
            ref={selected}
            position={[-182, -1]}
            height={64}
            fill={highlightColor}
            smoothCorners
            radius={15}
          />
          <Txt text={date.format('DD')} fill="white" ref={txtDays} />
          <Txt text="/" scale={0.85} fill={separatorColor} />
          <Txt text={date.format('MM')} fill="black" ref={txtMonths} />
          <Txt text="/" scale={0.85} fill={separatorColor} />
          <Txt text={date.format('YYYY')} fill="black" ref={txtYears} />

          <Rect width={20} shrink={0} />

          <Txt text={date.format('HH')} fill="black" ref={txtHours} />
          <Txt text=":" scale={0.85} fill={separatorColor} />
          <Txt text={date.format('mm')} fill="black" ref={txtMinutes} />
          <Txt
            text=":"
            scale={0.85}
            fill={separatorColor}
            ref={secondSeparator}
          />
          <Txt text={date.format('ss')} fill="black" ref={txtSeconds} />

          <Txt
            text={date.format('A')}
            fill="white"
            opacity={0}
            position={[380, -32]}
            ref={txtAmPm}
            layout={false}
          />
        </Rect>
      </CameraView>
    </Node>,
  )

  selected().width(txtDays().width() + selectedPadding)

  // initial zoom in:
  yield* all(
    camera().opacity(1, 0.5, easeInSine),
    background().stroke(highlightColor, 0.5),
    camera().shift(Vector2.left.addX(150)),
    camera().zoomOnto(selected(), 1.5, 200),
  )

  // select months field:
  yield* all(
    txtDays().fill('black', 0.5),
    camera().shift(Vector2.left.addX(100)),
    selected().position.x(txtMonths().position.x, 0.5),
    txtMonths().fill('white', 0.5),
  )

  // press/hold up in months field:
  const minWaitTime = 0.05 // Minimum wait time in seconds
  const maxWaitTime = 0.25 // Maximum wait time in seconds

  const count = 23
  for (let i = 0; i < count; i++) {
    const progress = i / (count - 1) // Get a value between 0 and 1 representing our progress through the loop
    const easedProgress = easeInOutQuad(progress) // Apply the sine easing function to this value

    // Interpolate between the min and max wait times based on our eased progress
    const waitTime = minWaitTime + (maxWaitTime - minWaitTime) * easedProgress

    yield* delay(waitTime, () => {
      date = date.add(1, 'month')
      updateDateRefs()
    })
  }

  // last delay a bit longer, for more "dramatic" effect:
  yield* delay(0.55, () => {
    date = date.add(1, 'month')
    updateDateRefs()
  })

  yield* waitFor(1)

  // select year field
  yield* all(
    txtMonths().fill('black', 0.5),
    selected().width(txtYears().width() + selectedPadding, 0.5),
    selected().position.x(txtYears().position.x, 0.5),
    camera().shift(Vector2.left.addX(236)),
    txtYears().fill('white', 0.5),
  )

  // type in year field:
  date = date.set('year', 2019)

  for (let i = 0; i < 4; i++) {
    yield* delay(random.nextFloat(0.375, 0.65), () =>
      txtYears().text(
        date
          .format('YYYY')
          .slice(0, i + 1)
          .padStart(4, '0'),
      ),
    )
  }

  yield* waitFor(0.5)

  // decrease minutes to see all values change:
  yield* all(
    txtYears().fill('black', 0.75),
    txtSeconds().fill('white', 0.75),
    selected().width(txtAmPm().width() + selectedPadding, 0.75),
    selected().position.x(txtAmPm().position().x, 0.75),
    camera().shift(Vector2.left.addX(-55), 0.75),
    camera().zoom(2.1, 0.75),
  )

  yield* waitFor(0.5)

  // switch to am/pm:
  hour12 = true

  yield* all(
    txtAmPm().opacity(1, 1),
    txtAmPm().fill('white', 1),
    delay(0.7, () => updateDateRefs()),
    txtAmPm().position.y(0, 1, easeInOutElastic),
    txtSeconds().fill('black', 1),
    txtSeconds().position.y(100, 1, easeInOutElastic),
    txtSeconds().opacity(0, 1),
    secondSeparator().opacity(0, 1),
  )

  yield* waitFor(1 / 3)

  // select minutes:
  yield* all(
    selected().position(Vector2.right.scale(277), 0.5),
    txtAmPm().fill('black', 0.5),
    txtMinutes().fill('white', 0.5),
  )

  const fadeOutDuration = 3

  date = date.subtract(1, 'minutes')
  updateDateRefs()

  yield* waitFor(1)

  // fade out and count down infinitely:
  yield* all(
    delay(1, camera().opacity(0, fadeOutDuration, linear)),
    // delay(1, layout().opacity(0, fadeOutDuration, linear)),
    // delay(1, background().stroke('white', fadeOutDuration, linear)),
    delay(1, camera().reset(fadeOutDuration)),
    loopFor(fadeOutDuration + 1, (i) =>
      delay(0.05 / Math.sqrt(i + 1), () => {
        date = date.subtract(1, 'minutes')
        updateDateRefs()
      }),
    ),
  )
})
