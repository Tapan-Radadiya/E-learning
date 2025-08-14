package utils

import (
	"encoding/json"
	"fmt"
	"log"
)

func GetJsonMarshalData(data any) []byte {
	marsheledData, err := json.Marshal(data)
	if err != nil {
		log.Fatal("Error Marsheling Json")
	}
	return marsheledData
}

func GetJsonUnmarshalData(data string, structData interface{}) {
	
	err := json.Unmarshal([]byte(data), structData)
	if err != nil {
		fmt.Printf("Error unmarshl JSON %v", err)
	}
	fmt.Printf("Data After %v\n", structData)
}
