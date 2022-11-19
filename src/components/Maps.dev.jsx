import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";

const Maps = ({ center, apiKey }) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  return (
    <div>
      {isLoaded ? (
        <GoogleMap
          id="map"
          mapContainerStyle={{
            width: "100vw",
            height: "100vh",
            position: "absolute",
            zIndex: 0,
          }}
          center={center}
          options={{
            disableDefaultUI: true,
            scrollwheel: false,
          }}
          zoom={15}
        ></GoogleMap>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Maps;
