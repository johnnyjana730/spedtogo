
import { StyleSheet } from 'react-native';

const isNotMobile = window.innerWidth > 800;

const name_font = isNotMobile ? 20 : 14;

const noteBoxTitle_font = isNotMobile ? 16 : 10;
const KBnoteBoxTitle_font = isNotMobile ? 14 : 10;
const addText_font = isNotMobile ? 16 : 10;

const noteBoxCard_margin = isNotMobile ? 5 : 2;
const noteBoxCard_minWidth = isNotMobile ? 320 : 230;
const noteBoxCard_maxWidth = isNotMobile ? 500 : 350;

const card_left = isNotMobile ? "0%" : "-8%";

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    margin: 5,
    left: card_left,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(0, 0, 0, 0.2)', // Darken the shadow color
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
  },
  noteBoxCard: {
    flexDirection: 'row',
    margin: noteBoxCard_margin,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 5,
    minWidth: noteBoxCard_minWidth,
    maxWidth: noteBoxCard_maxWidth,
  },
  keywordpopout: {
    position: 'absolute',
    top: '-100%', // Adjust the positioning as needed
    left: "-5%",
    backgroundColor: 'white',
    padding: 8,
    fontSize: 16,
    borderRadius: 10, // You can adjust the value to control the roundness of the box
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Adjust the values for the shadow as needed
    zIndex: 100000000000000
  },
  photo: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  info: {
    flex: 1,
    padding: 10,
  },
  name: {
    fontSize: name_font,
    fontWeight: 'bold',
    color: '#000000',
  },
  noteBoxName: {
  },
  noteBoxTitle: {
    fontSize: noteBoxTitle_font,
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  rowContainer: {
    flexDirection: 'row',
    // Add other styles as needed
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
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
  },
  addButton: {
    backgroundColor: '#00BFFF',
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  addButton_keyword: {

  },
  addText: {
    fontSize: addText_font,
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
    zIndex: 10000000,
  },
  guideButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: noteBoxTitle_font,
  },
  guideButtonTextKBox: {
    color: "white",
    fontWeight: "bold",
    fontSize: KBnoteBoxTitle_font,
  },
  ratingText: {
    flexDirection: 'row',
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 8,
    marginLeft: 4,
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

export default styles;