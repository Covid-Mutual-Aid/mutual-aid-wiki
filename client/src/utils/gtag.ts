declare let window: any
export let gtag = window.gtag

const gaTags = {
  mapMoved: () =>
    gtag('event', 'Map was dragged', {
      event_category: 'Map',
      event_label: 'Drag map',
    }),
  groupClicked: () =>
    gtag('event', 'Marker was clicked', {
      event_category: 'Map',
      event_label: 'Click marker',
    }),
}

export default gaTags
