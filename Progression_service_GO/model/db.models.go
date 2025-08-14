package model

import (
	"time"

	"github.com/google/uuid"
)

type UserXp struct {
	ID        uuid.UUID `json:"id" gorm:"primaryKey:column:id"`
	XPPoints  int64     `json:"xp_point" gorm:"column:xp_points"`
	UserId    uuid.UUID `json:"userid" gorm:"column:userid"`
	CreatedAt time.Time `json:"createdat" gorm:"column:createdat"`
	UpdatedAt time.Time `json:"updatedat" gorm:"autoUpdateTime:nano:column:updatedat"`
}

type UserXpEvents struct {
	ID        uuid.UUID `json:"id" gorm:"primaryKey"`
	XpEvent   string    `json:"xpevent" gorm:"column:xp_event;unique;not null"`
	XpPoints  int       `json:"xppoints" gorm:"column:xp_points"`
	CreatedAt time.Time `json:"createdat" gorm:"column:createdat"`
	UpdatedAt time.Time `json:"updatedat" gorm:"autoUpdateTime:nano:column:updatedat"`
}

type UserXpTrigger struct {
	XpEvent string    `json:"xpevent"`
	UserId  uuid.UUID `json:"userid"`
}
