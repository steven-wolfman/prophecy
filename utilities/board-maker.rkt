;; The first three lines of this file were inserted by DrRacket. They record metadata
;; about the language level of this file in a form that our tools can easily process.
#reader(lib "htdp-advanced-reader.ss" "lang")((modname board-maker) (read-case-sensitive #t) (teachpacks ()) (htdp-settings #(#t constructor repeating-decimal #t #t none #f () #f)))
(require 2htdp/image)

;; Point is (make-posn Natural Natural)
;; interp. an (x, y) coordinate in arb units

(define-struct terr (points type port? portal?))
;; Territory is (make-terr (listof Point) Type Boolean Boolean)
;; interp. a territory with its polygonal outline, type, and whether
;;         it is a port and has a magic portal. For now, the list of
;;         points is assumed to be length 4.
(define TERR-VILLAGE ;0
  (make-terr (list (make-posn 219 52) (make-posn 211 3) (make-posn 289 3) (make-posn 281 52))
             "Civilization"
             true
             false))
(define TERR-CITY ;7
  (make-terr (list (make-posn 428 341) (make-posn 473 363) (make-posn 427 427) (make-posn 391 391))
             "Civilization"
             true
             true))
(define TERR-MAGIC-WILD ;12
  (make-terr (list (make-posn 159 428) (make-posn 137 473) (make-posn 73 427) (make-posn 109 391))
             "Special"
             false
             true))
(define TERR-FOREST-AFTER-MW ;13
  (make-terr (list (make-posn 109 391) (make-posn 73 427) (make-posn 27 363) (make-posn 72 341))
             "Forest"
             false
             false))


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

(define TERRITORY-PORTS
  (list true     ; Village
        false
        false    ; Magic Tower
        false
        true
        false
        false    ; Monastery
        true     ; City
        false
        false
        false    ; Fortress
        true
        false    ; Magic Wilderness
        false
        false    ; Forest Camp
        true
        false
        false
        false    ; Thieves' Guild
        false))

(define TERRITORY-PORTALS
  (list false    ; Village
        true
        false    ; Magic Tower
        false
        false
        false
        false    ; Monastery
        true     ; City
        false
        false
        false    ; Fortress
        false
        true     ; Magic Wilderness
        false
        false    ; Forest Camp
        false
        false
        true
        false    ; Thieves' Guild
        false))

(define SPACES
  (segments 20 200 50))

(define TERRITORIES
  (map make-terr SPACES TERRITORY-TYPES TERRITORY-PORTS TERRITORY-PORTALS))

(define BOARD
  (foldr show-territory
         empty-image
         TERRITORIES))

(define COORDINATES
  (foldr (λ (s1 s2) (string-append s1 "\n" s2))
         ""
         (map (λ (segment)
                (foldr (λ (s1 s2) (string-append s1 " " s2))
                       ""
                       (map (λ (pt) (string-append "(" (number->string (posn-x pt)) "," (number->string (posn-y pt)) ")"))
                            segment)))
              (map terr-points TERRITORIES))))


;; Territory -> String
;; produce resource-pack suitable text for the territory
(check-expect (territory->resource-str 0 TERR-VILLAGE)
              "{ // 0\ntitle:\"0\",\npolygon:new Foundation.Polygon(219,52,211,3,289,3,281,52),\nadjacentIndices:[19,1],\nterrtype:\"Civilization\",\nport:true,\nportal:false\n}")
(check-expect (territory->resource-str 7 TERR-CITY)
              "{ // 7\ntitle:\"7\",\npolygon:new Foundation.Polygon(428,341,473,363,427,427,391,391),\nadjacentIndices:[6,8],\nterrtype:\"Civilization\",\nport:true,\nportal:true\n}")
(check-expect (territory->resource-str 12 TERR-MAGIC-WILD)
              "{ // 12\ntitle:\"12\",\npolygon:new Foundation.Polygon(159,428,137,473,73,427,109,391),\nadjacentIndices:[11,13],\nterrtype:\"Special\",\nport:false,\nportal:true\n}")
(check-expect (territory->resource-str 13 TERR-FOREST-AFTER-MW)
              "{ // 13\ntitle:\"13\",\npolygon:new Foundation.Polygon(109,391,73,427,27,363,72,341),\nadjacentIndices:[12,14],\nterrtype:\"Forest\",\nport:false,\nportal:false\n}")
(define (territory->resource-str index terr)
  (local [(define TERRITORY-RESOURCE-FMT
            "{ // ~a\ntitle:\"~a\",\npolygon:new Foundation.Polygon(~a,~a,~a,~a,~a,~a,~a,~a),\nadjacentIndices:[~a,~a],\nterrtype:~s,\nport:~a,\nportal:~a\n}")
          (define (bool->string b) (if b "true" "false"))]
    (format TERRITORY-RESOURCE-FMT
            index
            index
            (posn-x (list-ref (terr-points terr) 0))
            (posn-y (list-ref (terr-points terr) 0))
            (posn-x (list-ref (terr-points terr) 1))
            (posn-y (list-ref (terr-points terr) 1))
            (posn-x (list-ref (terr-points terr) 2))
            (posn-y (list-ref (terr-points terr) 2))
            (posn-x (list-ref (terr-points terr) 3))
            (posn-y (list-ref (terr-points terr) 3))
            (modulo (sub1 index) (length TERRITORIES))
            (modulo (add1 index) (length TERRITORIES))
            (terr-type terr)
            (if (terr-port? terr) "true" "false")
            (if (terr-portal? terr) "true" "false"))))

(define TERRITORY-RESOURCES
  (build-list (length TERRITORIES)
              (λ(i)
                (territory->resource-str i (list-ref TERRITORIES i)))))

(define TERRITORY-RESOURCE-STRING
  (foldr (λ(terr-str rest-terr-str) (string-append terr-str ",\n" rest-terr-str)) ""
         TERRITORY-RESOURCES))