;; The first three lines of this file were inserted by DrRacket. They record metadata
;; about the language level of this file in a form that our tools can easily process.
#reader(lib "htdp-advanced-reader.ss" "lang")((modname board-maker) (read-case-sensitive #t) (teachpacks ()) (htdp-settings #(#t constructor repeating-decimal #t #t none #f () #f)))
(require 2htdp/image)

;; Point is (make-posn Natural Natural)
;; interp. an (x, y) coordinate in arb units

(define-struct terr (points type))
;; Territory is (make-terr (listof Point) Type)
;; interp. a territory with its polygonal outline and type

;; Type is one of:
;; - "Civilization"
;; - "Special"      ; only the magic wilderness
;; - "Forest"
;; - "Mountain"
;; - "Plains"
;; interp. a terrain type

(define (fn-for-type t)
  (cond [(string=? "Civilization" t) (...)]
        [(string=? "Special" t)      (...)]
        [(string=? "Forest" t)       (...)]
        [(string=? "Mountain" t)     (...)]
        [(string=? "Plains" t)        (...)]))


;; Type -> String
;; produce the web colour code for the given terrain type
(check-expect (terrain-color "Civilization") "#C0C0FF") ;light blue
(check-expect (terrain-color "Special")      "#F88017") ;dark orange
(check-expect (terrain-color "Forest")       "#30A030") ;forest green
(check-expect (terrain-color "Mountain")     "#909090") ;middling grey
(check-expect (terrain-color "Plains")        "#F0F030") ;light yellow

(define (terrain-color t)
  (cond [(string=? "Civilization" t) "#C0C0FF"]
        [(string=? "Special" t)      "#F88017"]
        [(string=? "Forest" t)       "#30A030"]
        [(string=? "Mountain" t)     "#909090"]
        [(string=? "Plains" t)        "#F0F030"]))

;; Territory -> Color
;; produce the color of the territory
(define (territory-color t)
  (hex->color (terrain-color (terr-type t))))

;; String -> Color
;; produce the color corresponding to the given html hex color
(check-expect (hex->color "#F0B335")
              (make-color (string->number "F0" 16)
                          (string->number "B3" 16)
                          (string->number "35" 16)))
(check-expect (hex->color "#000000")
              (make-color 0 0 0))
(check-expect (hex->color "#FFFFFF")
              (make-color 255 255 255))

(define (hex->color color)
  (local [;; Natural[0,2] String -> Natural[0,255]
          ;; extracts the base 10 color (0=red, 1=green, 2=blue) from the html hex color spec "color" 
          (define (subcolor i)
            (string->number (substring color (+ 1 (* 2 i)) (+ 3 (* 2 i))) 16))]
    (make-color (subcolor 0)
                (subcolor 1)
                (subcolor 2))))



;; Type -> Image
;; produce a patch of the given terrain type's color
(check-expect (color-test "Civilization")
              (square 20 "solid" (make-color (string->number "C0" 16)
                                             (string->number "C0" 16)
                                             (string->number "FF" 16))))
(define (color-test t)
  (square 20 "solid" (hex->color (terrain-color t))))

(define (hex->patch color)
  (square 20 "solid" (hex->color color)))

#;
(beside (color-test "Civilization")
        (color-test "Special")
        (color-test "Forest")
        (color-test "Mountain")
        (color-test "Plains"))


;; Natural[>2] Natural Natural -> (listof (listof Point))
;; produce a list of (4-pointed) polygons representing n wedges of a "tire" with inner radius ir and thickness dr
(check-expect (segments 3 20 5)
              (local [(define th-offset (- 0 (/ (* 2 pi) (* 2 3)) (/ pi 2)))
                      (define th0 (+ (* 0 (/ (* 2 pi) 3)) th-offset))
                      (define th1 (+ (* 1 (/ (* 2 pi) 3)) th-offset))
                      (define th2 (+ (* 2 (/ (* 2 pi) 3)) th-offset))]
                (list (list (make-posn (+ 20 5 (inexact->exact (round (* 20 (cos th0))))) (+ 20 5 (inexact->exact (round (* 20 (sin th0))))))
                            (make-posn (+ 20 5 (inexact->exact (round (* 25 (cos th0))))) (+ 20 5 (inexact->exact (round (* 25 (sin th0))))))
                            (make-posn (+ 20 5 (inexact->exact (round (* 25 (cos th1))))) (+ 20 5 (inexact->exact (round (* 25 (sin th1))))))
                            (make-posn (+ 20 5 (inexact->exact (round (* 20 (cos th1))))) (+ 20 5 (inexact->exact (round (* 20 (sin th1)))))))
                      (list (make-posn (+ 20 5 (inexact->exact (round (* 20 (cos th1))))) (+ 20 5 (inexact->exact (round (* 20 (sin th1))))))
                            (make-posn (+ 20 5 (inexact->exact (round (* 25 (cos th1))))) (+ 20 5 (inexact->exact (round (* 25 (sin th1))))))
                            (make-posn (+ 20 5 (inexact->exact (round (* 25 (cos th2))))) (+ 20 5 (inexact->exact (round (* 25 (sin th2))))))
                            (make-posn (+ 20 5 (inexact->exact (round (* 20 (cos th2))))) (+ 20 5 (inexact->exact (round (* 20 (sin th2)))))))
                      (list (make-posn (+ 20 5 (inexact->exact (round (* 20 (cos th2))))) (+ 20 5 (inexact->exact (round (* 20 (sin th2))))))
                            (make-posn (+ 20 5 (inexact->exact (round (* 25 (cos th2))))) (+ 20 5 (inexact->exact (round (* 25 (sin th2))))))
                            (make-posn (+ 20 5 (inexact->exact (round (* 25 (cos th0))))) (+ 20 5 (inexact->exact (round (* 25 (sin th0))))))
                            (make-posn (+ 20 5 (inexact->exact (round (* 20 (cos th0))))) (+ 20 5 (inexact->exact (round (* 20 (sin th0))))))))))
(check-expect (segments 4 10 2)
              (local [(define th-offset (- 0 (/ (* 2 pi) (* 2 4)) (/ pi 2)))
                      (define th0 (+ (* 0 (/ (* 2 pi) 4)) th-offset))
                      (define th1 (+ (* 1 (/ (* 2 pi) 4)) th-offset))
                      (define th2 (+ (* 2 (/ (* 2 pi) 4)) th-offset))
                      (define th3 (+ (* 3 (/ (* 2 pi) 4)) th-offset))]
                (list (list (make-posn (+ 10 2 (inexact->exact (round (* 10 (cos th0))))) (+ 10 2 (inexact->exact (round (* 10 (sin th0))))))
                            (make-posn (+ 10 2 (inexact->exact (round (* 12 (cos th0))))) (+ 10 2 (inexact->exact (round (* 12 (sin th0))))))
                            (make-posn (+ 10 2 (inexact->exact (round (* 12 (cos th1))))) (+ 10 2 (inexact->exact (round (* 12 (sin th1))))))
                            (make-posn (+ 10 2 (inexact->exact (round (* 10 (cos th1))))) (+ 10 2 (inexact->exact (round (* 10 (sin th1)))))))
                      (list (make-posn (+ 10 2 (inexact->exact (round (* 10 (cos th1))))) (+ 10 2 (inexact->exact (round (* 10 (sin th1))))))
                            (make-posn (+ 10 2 (inexact->exact (round (* 12 (cos th1))))) (+ 10 2 (inexact->exact (round (* 12 (sin th1))))))
                            (make-posn (+ 10 2 (inexact->exact (round (* 12 (cos th2))))) (+ 10 2 (inexact->exact (round (* 12 (sin th2))))))
                            (make-posn (+ 10 2 (inexact->exact (round (* 10 (cos th2))))) (+ 10 2 (inexact->exact (round (* 10 (sin th2)))))))
                      (list (make-posn (+ 10 2 (inexact->exact (round (* 10 (cos th2))))) (+ 10 2 (inexact->exact (round (* 10 (sin th2))))))
                            (make-posn (+ 10 2 (inexact->exact (round (* 12 (cos th2))))) (+ 10 2 (inexact->exact (round (* 12 (sin th2))))))
                            (make-posn (+ 10 2 (inexact->exact (round (* 12 (cos th3))))) (+ 10 2 (inexact->exact (round (* 12 (sin th3))))))
                            (make-posn (+ 10 2 (inexact->exact (round (* 10 (cos th3))))) (+ 10 2 (inexact->exact (round (* 10 (sin th3)))))))
                      (list (make-posn (+ 10 2 (inexact->exact (round (* 10 (cos th3))))) (+ 10 2 (inexact->exact (round (* 10 (sin th3))))))
                            (make-posn (+ 10 2 (inexact->exact (round (* 12 (cos th3))))) (+ 10 2 (inexact->exact (round (* 12 (sin th3))))))
                            (make-posn (+ 10 2 (inexact->exact (round (* 12 (cos th0))))) (+ 10 2 (inexact->exact (round (* 12 (sin th0))))))
                            (make-posn (+ 10 2 (inexact->exact (round (* 10 (cos th0))))) (+ 10 2 (inexact->exact (round (* 10 (sin th0))))))))))

(define (segments n ir dr)
  (local [(define th-offset (- 0 (/ (* 2 pi) (* 2 n)) (/ pi 2)))
          (define thetas (build-list n
                                     (λ (i) (+ (* i (/ (* 2 pi) n)) th-offset))))]
    (build-list n (λ (segment)
                    (list
                     (make-posn (+ ir dr (inexact->exact (round (* ir (cos (list-ref thetas (modulo segment n)))))))
                                (+ ir dr (inexact->exact (round (* ir (sin (list-ref thetas (modulo segment n))))))))
                     (make-posn (+ ir dr (inexact->exact (round (* (+ ir dr) (cos (list-ref thetas (modulo segment n)))))))
                                (+ ir dr (inexact->exact (round (* (+ ir dr) (sin (list-ref thetas (modulo segment n))))))))
                     (make-posn (+ ir dr (inexact->exact (round (* (+ ir dr) (cos (list-ref thetas (modulo (add1 segment) n)))))))
                                (+ ir dr (inexact->exact (round (* (+ ir dr) (sin (list-ref thetas (modulo (add1 segment) n))))))))
                     (make-posn (+ ir dr (inexact->exact (round (* ir (cos (list-ref thetas (modulo (add1 segment) n)))))))
                                (+ ir dr (inexact->exact (round (* ir (sin (list-ref thetas (modulo (add1 segment) n)))))))))))))



;; (listof Point) Image -> Image
;; produce the segment overlaid on the background image
(define (show-segment segment image)
  (add-polygon image
               segment
               "outline"
               "black"))


;; Territory Image -> Image
;; display the territory t overlaid on the background image
(define (show-territory t image)
  (add-polygon (add-polygon image
                            (terr-points t)
                            "solid"
                            (territory-color t))
               (terr-points t)
               "outline"
               "black"))

(define TERRITORY-TYPES
  (list "Civilization"    ; Village
        "Mountain"
        "Civilization"    ; Magic Tower
        "Forest"
        "Plains"
        "Forest"
        "Civilization"    ; Monastery
        "Civilization"    ; City
        "Plains"
        "Mountain"
        "Civilization"    ; Fortress
        "Plains"
        "Special"         ; Magic Wilderness
        "Forest"
        "Civilization"    ; Forest Camp
        "Mountain"
        "Plains"
        "Forest"
        "Civilization"    ; Thieves' Guild
        "Plains"))

(define SPACES
  (segments 20 200 50))

(define TERRITORIES
  (map make-terr SPACES TERRITORY-TYPES))
