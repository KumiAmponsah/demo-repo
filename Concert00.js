import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Image, ScrollView, Dimensions, Pressable, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from './supabaseClient'; // Adjust the path to your Supabase client

const { width, height } = Dimensions.get('window');

const App = () => {
  const [concerts, setConcerts] = useState([]);

  useEffect(() => {
    fetchConcerts();
  }, []);

  const fetchConcerts = async () => {
    try {
      // Fetch concerts
      const { data: concertsData, error: concertsError } = await supabase
        .from('concerts')
        .select('id, concert_date, location'); // No artist_id in the concerts table

      if (concertsError) {
        console.error('Concerts fetch error:', concertsError.message || concertsError);
        throw concertsError;
      }

      if (!concertsData || concertsData.length === 0) {
        console.warn('No concerts found.');
        return;
      }

      // Extract artist IDs from concerts (assuming the artist IDs are stored elsewhere or need to be mapped)
      const artistIds = concertsData.map(concert => concert.id);

      // Fetch artists (assuming artist IDs are the same as concert IDs)
      const { data: artistsData, error: artistsError } = await supabase
        .from('artists')
        .select('id, name, artist_image_url')
        .in('id', artistIds);

      if (artistsError) {
        console.error('Artists fetch error:', artistsError.message || artistsError);
        throw artistsError;
      }

      if (!artistsData || artistsData.length === 0) {
        console.warn('No artists found.');
        return;
      }

      // Combine concert data with artist data
      const concertsWithArtists = concertsData.map(concert => {
        const artist = artistsData.find(artist => artist.id === concert.id); // Matching IDs
        return {
          ...concert,
          artist: artist || {}, // Fallback to an empty object if no matching artist
        };
      });

      console.log('Concerts with artists:', concertsWithArtists);

      setConcerts(concertsWithArtists);
    } catch (error) {
      console.error('Error fetching data:', error.message || error);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.concertAndSearch}>
          <Text style={styles.concertText}>Concerts</Text>
          <FontAwesome name="search" size={25} color="#ffffff" style={styles.icon} />
        </View>
        <View style={styles.line} />
        <Text style={styles.savedConcertText}>Saved Concerts</Text>
        <View style={styles.dashedRectangle}>
          <Text style={styles.rectangleText}>Concerts you save will show up here</Text>
        </View>
        <View style={styles.line} />
        <View style={styles.exploreForYou}>
          <Text style={styles.exploreText}>Explore:</Text>
          <Text style={styles.forYouText}>For you</Text>
          <FontAwesome name="angle-down" size={width * 0.06} color="#5e16ec" style={styles.icon2} />
        </View>
        <Text style={styles.artistsYouMeloraText}>Upcoming concerts from your discoveries</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.centeredButtonContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.btnText}>All locations</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.btnText}>Near me</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.imageContainer}>
          {concerts.map((concert) => (
            <View key={concert.id} style={styles.textContent}>
              <Image source={{ uri: concert.artist.artist_image_url }} style={styles.image} />
              <Text style={styles.dateText}>{concert.concert_date}</Text>
              <Text style={styles.NameText}>{concert.artist.name}</Text>
              <Text style={styles.locationText}>{concert.location}</Text>
            </View>
          ))}
        </View>

        <View style={styles.centeredContainer}>
          <View style={styles.centeredText}>
            <Image source={require('./assets/concertmore.jpg')} style={styles.centeredImage} />
            <Text style={styles.centeredTextTitle}>Recommended Concerts</Text>
            <Text style={styles.centeredTextSubtitle}>Find your next concert on Melora</Text>
          </View>
          <TouchableOpacity style={styles.centeredButton}>
            <Text style={styles.btnText}>Find a concert</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0131',
  },
  concertAndSearch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    marginTop: 13,
  },
  concertText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 20,
  },
  icon2: {
    marginLeft: 14,
    marginTop: 3,
  },
  calendaricon: {
     
  },
  line: {
    height: 1,
    backgroundColor: '#5e16ec',
    marginHorizontal: 20,
  },
  savedConcertText: {
    fontSize: 21,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft: 20,
  },
  dashedRectangle: {
    borderWidth: 1,
    borderColor: '#5e16ec',
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 12,
    alignItems: 'center',
    marginBottom: 30,
  },
  rectangleText: {
    color: '#C0C0C0',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 15,
  },
  exploreForYou: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  exploreText: {
    fontSize: 21,
    color: '#fff',
    marginRight: 10,
    fontWeight: 'bold',
  },
  forYouText: {
    fontSize: 21,
    color: '#5e16ec',
    fontWeight: 'bold',
  },
  artistsYouMeloraText: {
    fontSize: 16,
    color: '#C0C0C0',
    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 5,
  },
  centeredButtonContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#5e16ec',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 41,
    marginRight: 25,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 40,
  },
  image: {
    width: 125,
    height: 125,
    borderRadius: 90,
    justifyContent: 'space-around',
  },
  textContent: {
    marginLeft: 10,
    marginBottom: 20,
  },
  dateText: {
    fontSize: 15,
    color: '#fff',
    marginTop: 15,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  NameText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 6,
    textAlign: 'center',
    marginVertical: 2,
  },
  locationText: {
    fontSize: 15,
    color: '#C0C0C0',
    marginTop: 4,
    textAlign: 'center',
    marginVertical: 2,
    marginBottom: 10,
  },
  centeredContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  centeredImage: {
    width: 110,
    height: 110,
    borderRadius: 90,
    marginTop: 20,
  },
  centeredText: {
    alignItems: 'center',
  },
  centeredTextTitle: {
    fontSize: 17,
    color: '#C0C0C0',
    fontWeight: 'bold',
    marginTop: 20,
  },
  centeredTextSubtitle: {
    fontSize: 16,
    color: '#C0C0C0',
    fontWeight: '400',
    marginTop: 5,
    marginBottom: 5,
  },
  centeredButton: {
    backgroundColor: '#5e16ec',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 41,
    marginTop: 20,
    marginBottom: 35,
  },
});

export default App;