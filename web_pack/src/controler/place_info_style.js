
import { StyleSheet } from 'react-native';

const place_styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    margin: 5,
    borderRadius: 10,
    backgroundColor: 'rgba(236, 236, 236, 0.6)',
    shadowColor: 'rgba(0, 0, 0, 0.5)', // Darken the shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  noteBoxCard: {
    flexDirection: 'row',
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
    minWidth: 320,
    maxWidth: 500,
  },
  photo: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  keywordpopout: {
    position: 'absolute',
    top: '-100%', // Adjust the positioning as needed
    left: "-5%",
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 10, // You can adjust the value to control the roundness of the box
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Adjust the values for the shadow as needed
    zIndex: 100000000000000
  },
  info: {
    flex: 1,
    padding: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },

  noteBoxTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  reviewsText: {
    fontSize: 14,
    color: '#808080',
    marginLeft: 5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
    marginBottom: -4,
  },
  addButton: {
    backgroundColor: '#00BFFF',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  addText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  guideButtons: {
    flexDirection: "row",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    marginTop: 0,
  },
  guideButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    margin: 5,
  },
  guideButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 17,
  },
  ratingText: {
    flexDirection: 'row',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 5,
    marginLeft: 8,
    // marginVertical: 8,
  },  
  newSpannableSlot: {
    padding: 10,
    backgroundColor: 'lightgray', // Change the background color as needed
    marginTop: 10, // Adjust the margin as needed
  },    

  container: {
    // Container styles
    backgroundColor: 'lightgray',
    padding: 16,
    border: '1px solid #ccc',
    borderRadius: 8,
  },
  accordionContent: {
    // Accordion content styles
    margin: 16,
    padding: 16,
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: 8,
  },
  toggleAccordionButton: {
    // Toggle accordion button styles
    backgroundColor: 'dodgerblue',
    color: 'white',
    padding: 10,
    borderRadius: 4,
    textAlign: 'center',
  },
});

export default place_styles;