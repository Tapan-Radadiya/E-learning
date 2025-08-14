package ssehub

import (
	"log"
)

type Broker struct {
	Notifier    chan []byte
	NewClients  chan chan []byte
	CloseClient chan chan []byte
	Clients     map[chan []byte]bool
}

func (b *Broker) Listen() {
	for {
		select {
		case newConn := <-b.NewClients:
			// Establish New Connection
			b.Clients[newConn] = true
			log.Println("New Client Connected")
		case conn := <-b.CloseClient:
			// Close Client Connection
			delete(b.Clients, conn)
			log.Println("New Client Deleted")
		case event := <-b.Notifier:

			copyClients := make([]chan []byte, 0, len(b.Clients))

			for ch := range b.Clients {
				copyClients = append(copyClients, ch)
			}

			for _, ch := range copyClients {
				select {
				case ch <- event:
				default:
					log.Println("Dropped message for a slow client")

				}
			}
			// Get New Event And Send To All The Clients
		}
	}
}

var Hub = &Broker{
	Notifier:    make(chan []byte),
	NewClients:  make(chan chan []byte),
	CloseClient: make(chan chan []byte),
	Clients:     make(map[chan []byte]bool),
}

func init() {
	go Hub.Listen()
}
