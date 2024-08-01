import { FontAwesome } from "@expo/vector-icons";
import { Text, View, FlatList, TextInput, StyleSheet, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import SongComponent from "./SongComponent";
import ArtisteComponent from "./ArtisteComponents";
import { useNavigation } from '@react-navigation/native';

const SearchScreen2 = () => {
  const [search, setSearch] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [songs, setSongs] = useState([]);
  const [artists, setArtists] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleInputChange = (text) => {
    setQuery(text);
    setSearch(text.length > 0);
  };

  const handleSongPress = (item) => {
    if (item && item.id) {
      navigation.navigate('songCard', { searchQueryId: item.id });
    } else {
      console.error("Invalid item id");
    }
  };

  const handleArtistPress = (artist) => {
    console.log(`Artist pressed: ${artist.name}`);
  };

  useEffect(() => {
    const fetchSongsAndArtists = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        const songResponse = await supabase
          .from("songs")
          .select("id, title, artist, album_art_url")
          .ilike("title", `%${query}%`);

        const artistResponse = await supabase
          .from("artists")
          .select("name")
          .ilike("name", `%${query}%`);

        if (songResponse.error) throw songResponse.error;
        if (artistResponse.error) throw artistResponse.error;

        setSongs(songResponse.data || []);
        setArtists(artistResponse.data || []);
        console.log(songResponse.data, artistResponse.data);
      } catch (error) {
        setFetchError("Could not fetch data. Please try again.");
        setSongs([]);
        setArtists([]);
        console.error(error);
      }

      setLoading(false);
    };

    if (search) {
      fetchSongsAndArtists();
    } else {
      setSongs([]);
      setArtists([]);
    }
  }, [query]);

  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: "200", marginBottom: 10 }}>Music Search</Text>
      <View style={styles.inputContainer}>
        <FontAwesome name="arrow-left" size={25} color="white"  onPress={() => navigation.navigate('Home')}/>
        <TextInput
          style={styles.input}
          placeholder="Search for songs or artists"
          placeholderTextColor="grey"
          onChangeText={handleInputChange}
          value={query}
        />
        <FontAwesome
          name="close"
          size={25}
          color="white"
          onPress={() => handleInputChange("")}
        />
      </View>
      <FlatList
        ListHeaderComponent={() => (
          <View style={{ margin: 10 }}>
            {search && (
              <>
                <Text style={styles.headerText}>Top Results</Text>
                <Text style={styles.subHeaderText}>Songs</Text>
                {loading && <Text style={{ color: "white" }}>Loading...</Text>}
                {fetchError && <Text style={{ color: "red" }}>{fetchError}</Text>}
              </>
            )}
          </View>
        )}
        data={songs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => handleSongPress(item)}>
            <SongComponent
              Artiste={item.artist}
              SongTitle={item.title}
              imagePlaceholder={{ uri: item.album_art_url }}
            />
          </Pressable>
        )}
        ListFooterComponent={() => (
          <View style={{ margin: 10 }}>
            {search && (
              <>
                <Text style={styles.subHeaderText}>Artists</Text>
                {loading && <Text style={{ color: "white" }}>Loading...</Text>}
                {fetchError && <Text style={{ color: "red" }}>{fetchError}</Text>}
                <FlatList
                  data={artists}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item }) => (
                    <Pressable onPress={() => handleArtistPress(item)}>
                      <ArtisteComponent name={item.name} />
                    </Pressable>
                  )}
                />
                <Text style={styles.footerText}>View more</Text>
              </>
            )}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#252525",
    padding: 10,
  },
  input: {
    height: 30,
    paddingLeft: 30,
    fontSize: 18,
    color: "white",
    flex: 1,
  },
  inputContainer: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 0,
    alignSelf: "center",
    marginVertical: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 20,
  },
  subHeaderText: {
    fontSize: 30,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 20,
  },
  footerText: {
    fontSize: 20,
    fontWeight: "400",
    color: "lightblue",
    marginTop: 20,
  },
});

export default SearchScreen2;
